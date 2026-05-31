import { importRemoteAsset } from "../_lib/portfolio-store.js";
import { readJsonBody, requireAdminToken, sendMethodNotAllowed } from "../_lib/request.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  if (!requireAdminToken(req, res)) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const blob = await importRemoteAsset({
      sourceUrl: body.sourceUrl,
      folder: body.folder,
      filenameHint: body.filenameHint,
    });

    return res.status(200).json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (error) {
    console.error("Failed to import remote asset:", error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Gagal menyimpan file ke Vercel Blob.",
    });
  }
}