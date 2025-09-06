import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

/**
 * Request-Body (JSON):
 * { files: [{ name: string, type: string }, ...] }
 *
 * Response:
 * { uploads: [{ path: string, token: string }] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const files = Array.isArray(body?.files) ? body.files : [];
    if (!files.length) {
      return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    const uploads: Array<{ path: string; token: string }> = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i] || {};
      const ext =
        String((f.name || "").split(".").pop() || "jpg")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") || "jpg";
      const safe = `${Date.now()}_${i}.${ext}`.replace(/[^a-z0-9._-]/gi, "");
      const path = `uploads/${safe}`; // WICHTIG: ohne Bucket, ohne führenden Slash

      const { data, error } = await supabaseServer
        .storage
        .from("artworks")
        .createSignedUploadUrl(path);

      if (error || !data) {
        return NextResponse.json({ error: error?.message || "signed url failed" }, { status: 400 });
      }

      // SDKs liefern entweder 'token' oder 'signedUrl' (aus der wir das Token extrahieren)
      const token =
        (data as any).token ||
        (() => {
          try {
            const su = String((data as any).signedUrl || "");
            const qs = su.split("?")[1] || "";
            const params = new URLSearchParams(qs);
            return params.get("token") || "";
          } catch {
            return "";
          }
        })();

      if (!token) {
        return NextResponse.json({ error: "No token returned by createSignedUploadUrl" }, { status: 400 });
      }

      uploads.push({ path, token });
    }

    return NextResponse.json({ uploads });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 });
  }
}

// Hilft beim schnellen Health-Check im Browser
export async function GET() {
  return NextResponse.json({ alive: true, expects: "POST" }, { status: 200 });
}

// Optional (macht Preflight/CORS glücklich, falls nötig)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
