/**
 * Admin upload proxy.
 *
 * The browser can't read the httpOnly admin access cookie, so the uploader
 * components POST FormData here. This route reads the cookie server-side,
 * forwards the file to the backend's /api/file endpoint, and returns the
 * uploaded `File` document (including its public `url`).
 *
 * Streams the request body straight through to the backend rather than
 * parsing it with req.formData() and rebuilding a new FormData — that
 * buffer-then-rebuild approach was measured (a 700MB upload) at ~1.9GB of
 * resident memory, nearly 3x the file size, because the file exists at once
 * as the parsed File/Blob AND again as the re-encoded outgoing multipart
 * body. A raw pass-through keeps memory flat regardless of file size, since
 * the incoming body already has the right multipart framing (boundary and
 * all) for the backend's multer to parse — nothing needs to be re-parsed on
 * this hop, just relayed. Accepts up to MAX_UPLOAD_BYTES (see
 * lib/admin/upload-limits.ts) per the backend's file middleware limit.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import type { ApiResponse, UploadedFile } from "@/lib/admin/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(ADMIN_CONFIG.cookies.access)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  const contentType = req.headers.get("content-type");
  if (!contentType?.startsWith("multipart/form-data") || !req.body) {
    return NextResponse.json(
      { success: false, message: "Expected multipart/form-data" },
      { status: 400 },
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${ADMIN_CONFIG.apiUrl}/api/file`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": contentType,
        ...(ADMIN_CONFIG.serverApiKey && {
          "X-Server-Api-Key": ADMIN_CONFIG.serverApiKey,
        }),
      },
      body: req.body,
      // Required by undici/fetch whenever the body is a stream rather than
      // a fully-buffered value — see nodejs/node#46221.
      duplex: "half",
      cache: "no-store",
    } as RequestInit & { duplex: "half" });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Could not reach the upload server.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  const json = (await backendRes.json().catch(() => null)) as
    | ApiResponse<UploadedFile>
    | { success: false; message?: string }
    | null;

  if (!json) {
    return NextResponse.json(
      { success: false, message: "Invalid response from upload server." },
      { status: 502 },
    );
  }

  if (!backendRes.ok || json.success === false) {
    return NextResponse.json(json, { status: backendRes.status });
  }

  return NextResponse.json(json, { status: 200 });
}
