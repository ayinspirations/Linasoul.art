import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");

/**
 * Body: { files: [{ name: string, type: string }, ...] }
 * Antwort: { uploads: [{ path: string, uploadUrl: string }] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const files = Array.isArray(body?.files) ? body.files : [];
    if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });

    const uploads: Array<{ path: string; uploadUrl: string }> = [];

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

      if (error || !data) {
        return NextResponse.json({ error: error?.message || "signed url failed" }, { status: 400 });
      }

      // Verschiedene SDK-Versionen liefern unterschiedliche Felder:
      // - data.signedUrl (relativer Pfad, z.B. /object/sign/...)
      // - data.token (nur Token; Pfad müssen wir selbst bauen)
      const signedUrlRel = (data as any).signedUrl as string | undefined;
      const token = (data as any).token as string | undefined;

      let uploadUrl: string;
      if (signedUrlRel) {
        uploadUrl = `${SUPABASE_URL}/storage/v1${signedUrlRel}`;
      } else if (token) {
        uploadUrl = `${SUPABASE_URL}/storage/v1/object/sign/artworks/${path}?token=${encodeURIComponent(
          token
        )}`;
      } else {
        return NextResponse.json({ error: "No signed data returned" }, { status: 400 });
      }

      uploads.push({ path, uploadUrl });
    }

    return NextResponse.json({ uploads });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 });
  }
}
