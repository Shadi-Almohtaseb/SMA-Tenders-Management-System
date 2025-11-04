"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var tenders_1 = require("./routes/tenders");
var auth_1 = require("./routes/auth");
var audit_1 = require("./routes/audit");
var attachments_1 = require("./routes/attachments");
var notifications_1 = require("./routes/notifications");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_1.authRouter);
app.use("/api/tenders", tenders_1.tendersRouter);
app.use("/api/audit", audit_1.auditRouter);
app.use("/api/attachments", attachments_1.attachmentsRouter);
app.use("/api/notifications", notifications_1.notificationsRouter);
app.get("/api/health", function (req, res) {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
