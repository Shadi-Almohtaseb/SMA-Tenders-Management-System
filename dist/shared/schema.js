"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachments = exports.auditLogs = exports.tenders = exports.users = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 50 }).notNull().default("user"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.tenders = (0, pg_core_1.pgTable)("tenders", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    ownerEntity: (0, pg_core_1.varchar)("owner_entity", { length: 500 }).notNull(),
    openingDate: (0, pg_core_1.varchar)("opening_date", { length: 50 }).notNull(),
    guaranteeAmount: (0, pg_core_1.decimal)("guarantee_amount", { precision: 15, scale: 2 }).notNull(),
    guaranteeExpiryDate: (0, pg_core_1.varchar)("guarantee_expiry_date", { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull(),
    awardedCompany: (0, pg_core_1.varchar)("awarded_company", { length: 500 }),
    notes: (0, pg_core_1.text)("notes"),
    createdBy: (0, pg_core_1.integer)("created_by").references(function () { return exports.users.id; }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.auditLogs = (0, pg_core_1.pgTable)("audit_logs", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    tenderId: (0, pg_core_1.integer)("tender_id").references(function () { return exports.tenders.id; }),
    userId: (0, pg_core_1.integer)("user_id").references(function () { return exports.users.id; }),
    action: (0, pg_core_1.varchar)("action", { length: 50 }).notNull(),
    changes: (0, pg_core_1.text)("changes"),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow().notNull(),
});
exports.attachments = (0, pg_core_1.pgTable)("attachments", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    tenderId: (0, pg_core_1.integer)("tender_id").references(function () { return exports.tenders.id; }).notNull(),
    fileName: (0, pg_core_1.varchar)("file_name", { length: 500 }).notNull(),
    filePath: (0, pg_core_1.varchar)("file_path", { length: 1000 }).notNull(),
    fileSize: (0, pg_core_1.integer)("file_size").notNull(),
    mimeType: (0, pg_core_1.varchar)("mime_type", { length: 100 }).notNull(),
    uploadedBy: (0, pg_core_1.integer)("uploaded_by").references(function () { return exports.users.id; }),
    uploadedAt: (0, pg_core_1.timestamp)("uploaded_at").defaultNow().notNull(),
});
