const express = require("express");
const cors = require("cors");
const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { eq, desc, sql } = require("drizzle-orm");
require("dotenv").config();

const schema = require("../shared/schema-js");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.SESSION_SECRET || "default-secret-key-change-in-production";

if (!process.env.SESSION_SECRET) {
  console.warn("⚠️  WARNING: SESSION_SECRET not set! Using default key. Set SESSION_SECRET environment variable for production.");
}

app.use(cors());
app.use(express.json());

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(schema.users)
      .values({
        email,
        password: hashedPassword,
        name,
        role: "user",
      })
      .returning();

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/tenders", authenticate, async (req, res) => {
  try {
    const allTenders = await db.select().from(schema.tenders).orderBy(desc(schema.tenders.createdAt));
    res.json(allTenders);
  } catch (error) {
    console.error("Error fetching tenders:", error);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
});

app.get("/api/tenders/:id", authenticate, async (req, res) => {
  try {
    const [tender] = await db
      .select()
      .from(schema.tenders)
      .where(eq(schema.tenders.id, parseInt(req.params.id)))
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

app.post("/api/tenders", authenticate, async (req, res) => {
  try {
    const { ownerEntity, openingDate, guaranteeAmount, guaranteeExpiryDate, status, awardedCompany, notes } = req.body;

    const [newTender] = await db
      .insert(schema.tenders)
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

    await db.insert(schema.auditLogs).values({
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

app.put("/api/tenders/:id", authenticate, async (req, res) => {
  try {
    const tenderId = parseInt(req.params.id);
    const { ownerEntity, openingDate, guaranteeAmount, guaranteeExpiryDate, status, awardedCompany, notes } = req.body;

    const [existingTender] = await db
      .select()
      .from(schema.tenders)
      .where(eq(schema.tenders.id, tenderId))
      .limit(1);

    if (!existingTender) {
      return res.status(404).json({ error: "Tender not found" });
    }

    const [updatedTender] = await db
      .update(schema.tenders)
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
      .where(eq(schema.tenders.id, tenderId))
      .returning();

    await db.insert(schema.auditLogs).values({
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

app.delete("/api/tenders/:id", authenticate, async (req, res) => {
  try {
    const tenderId = parseInt(req.params.id);

    const [existingTender] = await db
      .select()
      .from(schema.tenders)
      .where(eq(schema.tenders.id, tenderId))
      .limit(1);

    if (!existingTender) {
      return res.status(404).json({ error: "Tender not found" });
    }

    await db.insert(schema.auditLogs).values({
      tenderId,
      userId: req.userId,
      action: "delete",
      changes: JSON.stringify({ tender: existingTender }),
    });

    await db.delete(schema.tenders).where(eq(schema.tenders.id, tenderId));

    res.json({ message: "Tender deleted successfully" });
  } catch (error) {
    console.error("Error deleting tender:", error);
    res.status(500).json({ error: "Failed to delete tender" });
  }
});

app.get("/api/audit/tender/:tenderId", authenticate, async (req, res) => {
  try {
    const tenderId = parseInt(req.params.tenderId);
    
    const logs = await db
      .select({
        id: schema.auditLogs.id,
        action: schema.auditLogs.action,
        changes: schema.auditLogs.changes,
        timestamp: schema.auditLogs.timestamp,
        userName: schema.users.name,
        userEmail: schema.users.email,
      })
      .from(schema.auditLogs)
      .leftJoin(schema.users, eq(schema.auditLogs.userId, schema.users.id))
      .where(eq(schema.auditLogs.tenderId, tenderId))
      .orderBy(desc(schema.auditLogs.timestamp));

    res.json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post("/api/attachments", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const tenderId = parseInt(req.body.tenderId);
    if (!tenderId) {
      return res.status(400).json({ error: "Tender ID is required" });
    }

    const [attachment] = await db
      .insert(schema.attachments)
      .values({
        tenderId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: req.userId,
      })
      .returning();

    res.status(201).json(attachment);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

app.get("/api/attachments/tender/:tenderId", authenticate, async (req, res) => {
  try {
    const tenderId = parseInt(req.params.tenderId);
    const files = await db.select().from(schema.attachments).where(eq(schema.attachments.tenderId, tenderId));
    res.json(files);
  } catch (error) {
    console.error("Error fetching attachments:", error);
    res.status(500).json({ error: "Failed to fetch attachments" });
  }
});

app.get("/api/attachments/:id/download", authenticate, async (req, res) => {
  try {
    const [attachment] = await db
      .select()
      .from(schema.attachments)
      .where(eq(schema.attachments.id, parseInt(req.params.id)))
      .limit(1);

    if (!attachment) {
      return res.status(404).json({ error: "File not found" });
    }

    if (!fs.existsSync(attachment.filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.download(attachment.filePath, attachment.fileName);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

app.delete("/api/attachments/:id", authenticate, async (req, res) => {
  try {
    const [attachment] = await db
      .select()
      .from(schema.attachments)
      .where(eq(schema.attachments.id, parseInt(req.params.id)))
      .limit(1);

    if (!attachment) {
      return res.status(404).json({ error: "File not found" });
    }

    if (fs.existsSync(attachment.filePath)) {
      fs.unlinkSync(attachment.filePath);
    }

    await db.delete(schema.attachments).where(eq(schema.attachments.id, parseInt(req.params.id)));

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

app.get("/api/notifications/expiring", authenticate, async (req, res) => {
  try {
    const daysThreshold = parseInt(req.query.days) || 5;
    
    const expiringTenders = await db
      .select()
      .from(schema.tenders)
      .where(
        sql`
          (DATE(${schema.tenders.guaranteeExpiryDate}) - CURRENT_DATE) >= 0
          AND (DATE(${schema.tenders.guaranteeExpiryDate}) - CURRENT_DATE) <= ${daysThreshold}
        `
      )
      .orderBy(sql`DATE(${schema.tenders.guaranteeExpiryDate})`);

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

app.post("/api/notifications/send-email", authenticate, async (req, res) => {
  try {
    const { recipientEmail, subject, tenderInfo } = req.body;
    
    if (!recipientEmail || !subject || !tenderInfo) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("📧 Email notification would be sent to:", recipientEmail);
    console.log("Subject:", subject);
    console.log("Tender:", tenderInfo);
    
    res.json({ 
      success: true,
      message: "Email notification logged. To enable actual email sending, please set up an email service (e.g., Resend, SendGrid) and configure SMTP credentials.",
      recipientEmail,
      subject
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.get("/api/tenders/export/pdf", authenticate, async (req, res) => {
  try {
    const PDFDocument = require("pdfkit");
    const allTenders = await db.select().from(schema.tenders).orderBy(desc(schema.tenders.createdAt));
    
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=tenders-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    doc.pipe(res);
    
    doc.fontSize(20).text('Tenders Report', { align: 'center' });
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, { align: 'center' });
    doc.moveDown(2);
    
    doc.fontSize(14).text(`Total Tenders: ${allTenders.length}`, { underline: true });
    doc.moveDown(1);
    
    allTenders.forEach((tender, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }
      
      doc.fontSize(12).text(`${index + 1}. Owner Entity: ${tender.ownerEntity}`, { bold: true });
      doc.fontSize(10).text(`   Opening Date: ${tender.openingDate}`);
      doc.fontSize(10).text(`   Guarantee Amount: ${parseFloat(tender.guaranteeAmount).toLocaleString('en-US', { style: 'currency', currency: 'SAR' })}`);
      doc.fontSize(10).text(`   Guarantee Expiry: ${tender.guaranteeExpiryDate}`);
      doc.fontSize(10).text(`   Status: ${tender.status}`);
      
      if (tender.awardedCompany) {
        doc.fontSize(10).text(`   Awarded Company: ${tender.awardedCompany}`);
      }
      
      if (tender.notes) {
        doc.fontSize(10).text(`   Notes: ${tender.notes.substring(0, 100)}${tender.notes.length > 100 ? '...' : ''}`);
      }
      
      doc.moveDown(0.5);
    });
    
    const totalGuaranteeAmount = allTenders.reduce((sum, t) => sum + parseFloat(t.guaranteeAmount), 0);
    const awardedCount = allTenders.filter(t => t.status === 'awarded').length;
    const underReviewCount = allTenders.filter(t => t.status === 'under_review').length;
    
    doc.addPage();
    doc.fontSize(16).text('Summary Statistics', { underline: true });
    doc.moveDown(1);
    doc.fontSize(12).text(`Total Guarantee Amount: ${totalGuaranteeAmount.toLocaleString('en-US', { style: 'currency', currency: 'SAR' })}`);
    doc.fontSize(12).text(`Awarded Tenders: ${awardedCount}`);
    doc.fontSize(12).text(`Under Review: ${underReviewCount}`);
    
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
});
