import crypto from "node:crypto";

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

const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function readSecretValue(value) {
  return String(value || "").trim();
}

function getAdminCredentials() {
  const legacyToken = readSecretValue(process.env.PORTFOLIO_ADMIN_TOKEN);
  const username = readSecretValue(process.env.PORTFOLIO_ADMIN_USERNAME) || "admin";
  const password = readSecretValue(process.env.PORTFOLIO_ADMIN_PASSWORD) || legacyToken;
  const sessionSecret = readSecretValue(process.env.PORTFOLIO_ADMIN_SESSION_SECRET) || legacyToken || password;

  return {
    username,
    password,
    legacyToken,
    sessionSecret,
  };
}

function hasConfiguredCredentials(credentials = getAdminCredentials()) {
  return Boolean(credentials.username && credentials.password && credentials.sessionSecret);
}

function timingSafeEquals(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function signAdminSessionPayload(encodedPayload, secret) {
  return crypto.createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function parseAdminSessionToken(sessionToken) {
  const token = String(sessionToken || "").trim();
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    return { encodedPayload, signature, payload };
  } catch {
    return null;
  }
}

export function createAdminSessionToken(username) {
  const credentials = getAdminCredentials();

  if (!hasConfiguredCredentials(credentials)) {
    throw new Error("PORTFOLIO_ADMIN_PASSWORD atau PORTFOLIO_ADMIN_TOKEN belum diatur di environment.");
  }

  const payload = {
    username: String(username || credentials.username).trim() || credentials.username,
    exp: Date.now() + ADMIN_SESSION_TTL_MS,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signAdminSessionPayload(encodedPayload, credentials.sessionSecret);

  return `${encodedPayload}.${signature}`;
}

export function validateAdminCredentials(providedUsername, providedPassword) {
  const credentials = getAdminCredentials();

  if (!hasConfiguredCredentials(credentials)) {
    return {
      ok: false,
      status: 500,
      error: "PORTFOLIO_ADMIN_USERNAME / PORTFOLIO_ADMIN_PASSWORD belum diatur. Jika belum memakai password terpisah, PORTFOLIO_ADMIN_TOKEN masih bisa dipakai sebagai password admin.",
    };
  }

  const username = String(providedUsername || "").trim();
  const password = String(providedPassword || "");

  if (!timingSafeEquals(username, credentials.username) || !timingSafeEquals(password, credentials.password)) {
    return {
      ok: false,
      status: 401,
      error: "Username atau password admin tidak valid.",
    };
  }

  return {
    ok: true,
    username: credentials.username,
  };
}

export function validateAdminSessionToken(sessionToken) {
  const credentials = getAdminCredentials();

  if (!hasConfiguredCredentials(credentials)) {
    return {
      ok: false,
      status: 500,
      error: "PORTFOLIO_ADMIN_PASSWORD atau PORTFOLIO_ADMIN_TOKEN belum diatur di environment.",
    };
  }

  const parsedToken = parseAdminSessionToken(sessionToken);
  if (!parsedToken) {
    return {
      ok: false,
      status: 401,
      error: "Sesi admin tidak valid.",
    };
  }

  const expectedSignature = signAdminSessionPayload(parsedToken.encodedPayload, credentials.sessionSecret);
  if (!timingSafeEquals(parsedToken.signature, expectedSignature)) {
    return {
      ok: false,
      status: 401,
      error: "Sesi admin tidak valid.",
    };
  }

  if (!parsedToken.payload?.exp || Number(parsedToken.payload.exp) <= Date.now()) {
    return {
      ok: false,
      status: 401,
      error: "Sesi admin sudah kedaluwarsa. Silakan login lagi.",
    };
  }

  if (!timingSafeEquals(parsedToken.payload?.username || "", credentials.username)) {
    return {
      ok: false,
      status: 401,
      error: "Sesi admin tidak cocok dengan username aktif.",
    };
  }

  return {
    ok: true,
    username: credentials.username,
  };
}

export function validateAdminToken(providedToken) {
  const token = String(providedToken || "").trim();
  const credentials = getAdminCredentials();

  if (!hasConfiguredCredentials(credentials)) {
    return {
      ok: false,
      status: 500,
      error: "PORTFOLIO_ADMIN_PASSWORD atau PORTFOLIO_ADMIN_TOKEN belum diatur di environment Vercel.",
    };
  }

  if (!token) {
    return {
      ok: false,
      status: 401,
      error: "Sesi admin tidak valid.",
    };
  }

  if (credentials.legacyToken && timingSafeEquals(token, credentials.legacyToken)) {
    return {
      ok: true,
      username: credentials.username,
      mode: "legacy-token",
    };
  }

  return validateAdminSessionToken(token);
}

export function requireAdminToken(req, res) {
  const validation = validateAdminToken(req.headers["x-admin-token"]);

  if (!validation.ok) {
    res.status(validation.status).json({ error: validation.error });
    return false;
  }

  return true;
}