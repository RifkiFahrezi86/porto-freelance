import { deleteAsset, importRemoteAsset, uploadAsset } from "../_lib/portfolio-store.js";
import { readJsonBody, requireAdminToken, sendMethodNotAllowed } from "../_lib/request.js";

export default async function handler(req, res) {
  if (!["POST", "DELETE"].includes(req.method)) {
    return sendMethodNotAllowed(res, ["POST", "DELETE"]);
  }

  if (!requireAdminToken(req, res)) {
    return;
  }

  try {
    const body = await readJsonBody(req);

    if (req.method === "DELETE") {
      await deleteAsset(body.url || body.pathname);

      return res.status(200).json({
        ok: true,
      });
    }

    const blob = body.sourceUrl
      ? await importRemoteAsset({
          sourceUrl: body.sourceUrl,
          folder: body.folder,
          filenameHint: body.filenameHint,
        })
      : await uploadAsset({
          fileBase64: body.fileBase64,
          originalFilename: body.originalFilename,
          contentType: body.contentType,
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