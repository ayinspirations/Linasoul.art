// app/api/admin/storage/signed-upload/route.ts
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer"; // Service-Role

export const runtime = "nodejs";

/** Body: { files: [{ name: string, type: string }, ...] } */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const files = Array.isArray(body?.files) ? body.files : [];
    if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });

    const uploads: Array<{ path: string; token: string }> = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i] || {};
      const ext =
        String((f.name || "").split(".").pop() || "jpg")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") || "jpg";
      const safe = `${Date.now()}_${i}.${ext}`.replace(/[^a-z0-9._-]/gi, "");
      const path = `uploads/${safe}`;

      const { data, error } = await supabaseServer
        .storage
        .from("artworks")
        .createSignedUploadUrl(path);

      if (error || !data?.token) {
        return NextResponse.json({ error: error?.message || "signed url failed" }, { status: 400 });
      }
      uploads.push({ path, token: data.token });
    }

    return NextResponse.json({ uploads });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 });
  }
}
