// Owner-only file uploads (lesson videos and documents) to Vercel Blob.
//
// The browser uploads DIRECTLY to Blob storage — this route only issues a
// short-lived signed token — so a 500 MB lecture recording never has to pass
// through a serverless function (which caps request bodies at a few MB).
//
// Requires a Blob store connected to the project (Vercel → Storage → Blob),
// which sets BLOB_READ_WRITE_TOKEN. Without it the route reports 503 and the
// Creator panel falls back to "paste a link" only.

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/session";

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const DOC_TYPES = [
  "application/pdf",
  "application/zip",
  "text/markdown",
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/gif",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/json",
];

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "File storage isn't connected yet. In Vercel → Storage → create a Blob store and link it to this project, then redeploy. Until then, paste a link instead.",
      },
      { status: 503 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      // runs BEFORE the browser is allowed to upload — the only gate
      onBeforeGenerateToken: async () => {
        const profile = await currentProfile();
        if (!profile || !profile.is_owner) {
          throw new Error("Not authorized.");
        }
        return {
          allowedContentTypes: [...VIDEO_TYPES, ...DOC_TYPES],
          addRandomSuffix: true,
          maximumSizeInBytes: 1024 * 1024 * 1024, // 1 GB
          tokenPayload: JSON.stringify({ handle: profile.handle }),
        };
      },
      onUploadCompleted: async () => {
        // nothing to do — the client saves the returned URL onto the day
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json(
      { error: message },
      { status: message === "Not authorized." ? 403 : 400 }
    );
  }
}
