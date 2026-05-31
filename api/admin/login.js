import {
  createAdminSessionToken,
  readJsonBody,
  sendMethodNotAllowed,
  validateAdminCredentials,
  validateAdminToken,
} from "../_lib/request.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    const payload = await readJsonBody(req);
    const sessionToken = String(payload?.sessionToken || payload?.token || req.headers["x-admin-token"] || "").trim();

    if (sessionToken) {
      const validation = validateAdminToken(sessionToken);

      if (!validation.ok) {
        return res.status(validation.status).json({ error: validation.error });
      }

      return res.status(200).json({
        ok: true,
        username: validation.username,
        token: createAdminSessionToken(validation.username),
      });
    }

    const username = String(payload?.username || req.headers["x-admin-username"] || "").trim();
    const password = String(payload?.password || req.headers["x-admin-password"] || "");
    const validation = validateAdminCredentials(username, password);

    if (!validation.ok) {
      return res.status(validation.status).json({ error: validation.error });
    }

    return res.status(200).json({
      ok: true,
      username: validation.username,
      token: createAdminSessionToken(validation.username),
    });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Gagal memproses login admin.",
    });
  }
}