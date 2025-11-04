import express from "express";
import { db } from "../db";
import { tenders } from "../../shared/schema";
import { authenticate, AuthRequest } from "../middleware/auth";
import { sql } from "drizzle-orm";

const router = express.Router();

router.get("/expiring", authenticate, async (req: AuthRequest, res) => {
  try {
    const daysThreshold = parseInt(req.query.days as string) || 5;
    
    const expiringTenders = await db
      .select()
      .from(tenders)
      .where(
        sql`
          (DATE(${tenders.guaranteeExpiryDate}) - CURRENT_DATE) >= 0
          AND (DATE(${tenders.guaranteeExpiryDate}) - CURRENT_DATE) <= ${daysThreshold}
        `
      )
      .orderBy(sql`DATE(${tenders.guaranteeExpiryDate})`);

    const result = expiringTenders.map((tender) => {
      const expiryDate = new Date(tender.guaranteeExpiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...tender,
        daysUntilExpiry,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching expiring tenders:", error);
    res.status(500).json({ error: "Failed to fetch expiring tenders" });
  }
});

router.post("/send-email", authenticate, async (req: AuthRequest, res) => {
  try {
    res.json({ message: "Email notifications feature coming soon" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export { router as notificationsRouter };
