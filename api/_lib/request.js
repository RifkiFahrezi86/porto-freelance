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

export function requireAdminToken(req, res) {
  const expectedToken = process.env.PORTFOLIO_ADMIN_TOKEN;

  if (!expectedToken) {
    res.status(500).json({
      error: "PORTFOLIO_ADMIN_TOKEN belum diatur di environment Vercel.",
    });
    return false;
  }

  const providedToken = req.headers["x-admin-token"];

  if (providedToken !== expectedToken) {
    res.status(401).json({ error: "Token admin tidak valid." });
    return false;
  }

  return true;
}