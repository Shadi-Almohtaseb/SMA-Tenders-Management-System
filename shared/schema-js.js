const { pgTable, text, serial, timestamp, integer, decimal, varchar } = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const tenders = pgTable("tenders", {
  id: serial("id").primaryKey(),
  ownerEntity: varchar("owner_entity", { length: 500 }).notNull(),
  openingDate: varchar("opening_date", { length: 50 }).notNull(),
  guaranteeAmount: decimal("guarantee_amount", { precision: 15, scale: 2 }).notNull(),
  guaranteeExpiryDate: varchar("guarantee_expiry_date", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  awardedCompany: varchar("awarded_company", { length: 500 }),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  tenderId: integer("tender_id").references(() => tenders.id),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 50 }).notNull(),
  changes: text("changes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  tenderId: integer("tender_id").references(() => tenders.id).notNull(),
  fileName: varchar("file_name", { length: 500 }).notNull(),
  filePath: varchar("file_path", { length: 1000 }).notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

module.exports = {
  users,
  tenders,
  auditLogs,
  attachments,
};
