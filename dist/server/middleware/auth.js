"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticate = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var JWT_SECRET = process.env.SESSION_SECRET || "default-secret-key-change-in-production";
var authenticate = function (req, res, next) {
    var _a;
    var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.authenticate = authenticate;
var requireAdmin = function (req, res, next) {
    if (req.userRole !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
