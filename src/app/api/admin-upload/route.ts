/**
 * Admin upload proxy.
 *
 * The browser can't read the httpOnly admin access cookie, so the uploader
 * components POST FormData here. This route reads the cookie server-side,
 * forwards the file to the backend's /api/file endpoint, and returns the
 * uploaded `File` document (including its public `url`).
 *
 * Accepts up to 50 MB per the backend's file middleware limit.
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

  const incoming = await req.formData();
  const file = incoming.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "No file provided in 'file' field" },
      { status: 400 },
    );
  }

  const forwarded = new FormData();
  forwarded.append("file", file, file.name);
  // optional metadata fields the backend file module accepts
  const name = incoming.get("name");
  if (typeof name === "string" && name) forwarded.append("name", name);
  const category = incoming.get("category");
  if (typeof category === "string" && category) forwarded.append("category", category);

  let backendRes: Response;
  try {
    backendRes = await fetch(`${ADMIN_CONFIG.apiUrl}/api/file`, {
      method: "POST",
      headers: { Authorization: token },
      body: forwarded,
      cache: "no-store",
    });
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
