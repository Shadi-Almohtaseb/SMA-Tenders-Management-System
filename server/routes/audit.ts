import express from "express";
import { db } from "../db";
import { auditLogs, users } from "../../shared/schema";
import { eq, desc } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/tender/:tenderId", authenticate, async (req: AuthRequest, res) => {
  try {
    const tenderId = parseInt(req.params.tenderId);
    
    const logs = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        changes: auditLogs.changes,
        timestamp: auditLogs.timestamp,
        userName: users.name,
        userEmail: users.email,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .where(eq(auditLogs.tenderId, tenderId))
      .orderBy(desc(auditLogs.timestamp));

    res.json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const logs = await db
      .select({
        id: auditLogs.id,
        tenderId: auditLogs.tenderId,
        action: auditLogs.action,
        changes: auditLogs.changes,
        timestamp: auditLogs.timestamp,
        userName: users.name,
        userEmail: users.email,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .orderBy(desc(auditLogs.timestamp))
      .limit(100);

    res.json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export { router as auditRouter };
