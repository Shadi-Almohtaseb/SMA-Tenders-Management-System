import express from "express";
import { db } from "../db";
import { tenders, auditLogs } from "../../shared/schema";
import { eq, desc } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const allTenders = await db.select().from(tenders).orderBy(desc(tenders.createdAt));
    res.json(allTenders);
  } catch (error) {
    console.error("Error fetching tenders:", error);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const [tender] = await db
      .select()
      .from(tenders)
      .where(eq(tenders.id, parseInt(req.params.id)))
      .limit(1);

    if (!tender) {
      return res.status(404).json({ error: "Tender not found" });
    }

    res.json(tender);
  } catch (error) {
    console.error("Error fetching tender:", error);
    res.status(500).json({ error: "Failed to fetch tender" });
  }
});

router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { ownerEntity, openingDate, guaranteeAmount, guaranteeExpiryDate, status, awardedCompany, notes } = req.body;

    const [newTender] = await db
      .insert(tenders)
      .values({
        ownerEntity,
        openingDate,
        guaranteeAmount,
        guaranteeExpiryDate,
        status,
        awardedCompany: awardedCompany || null,
        notes: notes || null,
        createdBy: req.userId,
      })
      .returning();

    await db.insert(auditLogs).values({
      tenderId: newTender.id,
      userId: req.userId,
      action: "create",
      changes: JSON.stringify({ tender: newTender }),
    });

    res.status(201).json(newTender);
  } catch (error) {
    console.error("Error creating tender:", error);
    res.status(500).json({ error: "Failed to create tender" });
  }
});

router.put("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const tenderId = parseInt(req.params.id);
    const { ownerEntity, openingDate, guaranteeAmount, guaranteeExpiryDate, status, awardedCompany, notes } = req.body;

    const [existingTender] = await db
      .select()
      .from(tenders)
      .where(eq(tenders.id, tenderId))
      .limit(1);

    if (!existingTender) {
      return res.status(404).json({ error: "Tender not found" });
    }

    const [updatedTender] = await db
      .update(tenders)
      .set({
        ownerEntity,
        openingDate,
        guaranteeAmount,
        guaranteeExpiryDate,
        status,
        awardedCompany: awardedCompany || null,
        notes: notes || null,
        updatedAt: new Date(),
      })
      .where(eq(tenders.id, tenderId))
      .returning();

    await db.insert(auditLogs).values({
      tenderId,
      userId: req.userId,
      action: "update",
      changes: JSON.stringify({ before: existingTender, after: updatedTender }),
    });

    res.json(updatedTender);
  } catch (error) {
    console.error("Error updating tender:", error);
    res.status(500).json({ error: "Failed to update tender" });
  }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const tenderId = parseInt(req.params.id);

    const [existingTender] = await db
      .select()
      .from(tenders)
      .where(eq(tenders.id, tenderId))
      .limit(1);

    if (!existingTender) {
      return res.status(404).json({ error: "Tender not found" });
    }

    await db.insert(auditLogs).values({
      tenderId,
      userId: req.userId,
      action: "delete",
      changes: JSON.stringify({ tender: existingTender }),
    });

    await db.delete(tenders).where(eq(tenders.id, tenderId));

    res.json({ message: "Tender deleted successfully" });
  } catch (error) {
    console.error("Error deleting tender:", error);
    res.status(500).json({ error: "Failed to delete tender" });
  }
});

export { router as tendersRouter };
