export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return req.body ? JSON.parse(req.body) : {};
  }

  const chunks = [];

  await new Promise((resolve, reject) => {
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", resolve);
    req.on("error", reject);
  });

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks.map((chunk) => Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))).toString("utf8");

  return raw ? JSON.parse(raw) : {};
}

export function sendMethodNotAllowed(res, methods) {
  res.setHeader("Allow", methods.join(", "));
  return res.status(405).json({ error: "Method tidak diizinkan." });
}

export function validateAdminToken(providedToken) {
  const expectedToken = process.env.PORTFOLIO_ADMIN_TOKEN;

  if (!expectedToken) {
    return {
      ok: false,
      status: 500,
      error: "PORTFOLIO_ADMIN_TOKEN belum diatur di environment Vercel.",
    };
  }

  if (providedToken !== expectedToken) {
    return {
      ok: false,
      status: 401,
      error: "Token admin tidak valid.",
    };
  }

  return { ok: true };
}

export function requireAdminToken(req, res) {
  const validation = validateAdminToken(req.headers["x-admin-token"]);

  if (!validation.ok) {
    res.status(validation.status).json({ error: validation.error });
    return false;
  }

  return true;
}