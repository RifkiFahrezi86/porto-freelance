import { readJsonBody, sendMethodNotAllowed, validateAdminToken } from "../_lib/request.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    const payload = await readJsonBody(req);
    const token = String(payload?.token || req.headers["x-admin-token"] || "").trim();
    const validation = validateAdminToken(token);

    if (!validation.ok) {
      return res.status(validation.status).json({ error: validation.error });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Gagal memproses login admin.",
    });
  }
}