import { readPortfolioData, writePortfolioData } from "../_lib/portfolio-store.js";
import { readJsonBody, requireAdminToken, sendMethodNotAllowed } from "../_lib/request.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const data = await readPortfolioData();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    if (!requireAdminToken(req, res)) {
      return;
    }

    try {
      const payload = await readJsonBody(req);
      const data = await writePortfolioData(payload);
      return res.status(200).json(data);
    } catch (error) {
      console.error("Failed to save portfolio data:", error);
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Gagal menyimpan portfolio.",
      });
    }
  }

  return sendMethodNotAllowed(res, ["GET", "PUT"]);
}