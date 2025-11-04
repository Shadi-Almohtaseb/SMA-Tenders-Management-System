"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRouter = void 0;
var express_1 = __importDefault(require("express"));
var db_1 = require("../db");
var schema_1 = require("../../shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
exports.auditRouter = router;
router.get("/tender/:tenderId", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenderId, logs, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tenderId = parseInt(req.params.tenderId);
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.auditLogs.id,
                        action: schema_1.auditLogs.action,
                        changes: schema_1.auditLogs.changes,
                        timestamp: schema_1.auditLogs.timestamp,
                        userName: schema_1.users.name,
                        userEmail: schema_1.users.email,
                    })
                        .from(schema_1.auditLogs)
                        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.auditLogs.userId, schema_1.users.id))
                        .where((0, drizzle_orm_1.eq)(schema_1.auditLogs.tenderId, tenderId))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.auditLogs.timestamp))];
            case 1:
                logs = _a.sent();
                res.json(logs);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching audit logs:", error_1);
                res.status(500).json({ error: "Failed to fetch audit logs" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var logs, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.auditLogs.id,
                        tenderId: schema_1.auditLogs.tenderId,
                        action: schema_1.auditLogs.action,
                        changes: schema_1.auditLogs.changes,
                        timestamp: schema_1.auditLogs.timestamp,
                        userName: schema_1.users.name,
                        userEmail: schema_1.users.email,
                    })
                        .from(schema_1.auditLogs)
                        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.auditLogs.userId, schema_1.users.id))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.auditLogs.timestamp))
                        .limit(100)];
            case 1:
                logs = _a.sent();
                res.json(logs);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching audit logs:", error_2);
                res.status(500).json({ error: "Failed to fetch audit logs" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
