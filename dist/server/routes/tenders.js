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
exports.tendersRouter = void 0;
var express_1 = __importDefault(require("express"));
var db_1 = require("../db");
var schema_1 = require("../../shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
exports.tendersRouter = router;
router.get("/", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allTenders, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.db.select().from(schema_1.tenders).orderBy((0, drizzle_orm_1.desc)(schema_1.tenders.createdAt))];
            case 1:
                allTenders = _a.sent();
                res.json(allTenders);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching tenders:", error_1);
                res.status(500).json({ error: "Failed to fetch tenders" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/:id", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tender, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.tenders)
                        .where((0, drizzle_orm_1.eq)(schema_1.tenders.id, parseInt(req.params.id)))
                        .limit(1)];
            case 1:
                tender = (_a.sent())[0];
                if (!tender) {
                    return [2 /*return*/, res.status(404).json({ error: "Tender not found" })];
                }
                res.json(tender);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching tender:", error_2);
                res.status(500).json({ error: "Failed to fetch tender" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ownerEntity, openingDate, guaranteeAmount, guaranteeExpiryDate, status_1, awardedCompany, notes, newTender, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, ownerEntity = _a.ownerEntity, openingDate = _a.openingDate, guaranteeAmount = _a.guaranteeAmount, guaranteeExpiryDate = _a.guaranteeExpiryDate, status_1 = _a.status, awardedCompany = _a.awardedCompany, notes = _a.notes;
                return [4 /*yield*/, db_1.db
                        .insert(schema_1.tenders)
                        .values({
                        ownerEntity: ownerEntity,
                        openingDate: openingDate,
                        guaranteeAmount: guaranteeAmount,
                        guaranteeExpiryDate: guaranteeExpiryDate,
                        status: status_1,
                        awardedCompany: awardedCompany || null,
                        notes: notes || null,
                        createdBy: req.userId,
                    })
                        .returning()];
            case 1:
                newTender = (_b.sent())[0];
                return [4 /*yield*/, db_1.db.insert(schema_1.auditLogs).values({
                        tenderId: newTender.id,
                        userId: req.userId,
                        action: "create",
                        changes: JSON.stringify({ tender: newTender }),
                    })];
            case 2:
                _b.sent();
                res.status(201).json(newTender);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error("Error creating tender:", error_3);
                res.status(500).json({ error: "Failed to create tender" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put("/:id", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenderId, _a, ownerEntity, openingDate, guaranteeAmount, guaranteeExpiryDate, status_2, awardedCompany, notes, existingTender, updatedTender, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                tenderId = parseInt(req.params.id);
                _a = req.body, ownerEntity = _a.ownerEntity, openingDate = _a.openingDate, guaranteeAmount = _a.guaranteeAmount, guaranteeExpiryDate = _a.guaranteeExpiryDate, status_2 = _a.status, awardedCompany = _a.awardedCompany, notes = _a.notes;
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.tenders)
                        .where((0, drizzle_orm_1.eq)(schema_1.tenders.id, tenderId))
                        .limit(1)];
            case 1:
                existingTender = (_b.sent())[0];
                if (!existingTender) {
                    return [2 /*return*/, res.status(404).json({ error: "Tender not found" })];
                }
                return [4 /*yield*/, db_1.db
                        .update(schema_1.tenders)
                        .set({
                        ownerEntity: ownerEntity,
                        openingDate: openingDate,
                        guaranteeAmount: guaranteeAmount,
                        guaranteeExpiryDate: guaranteeExpiryDate,
                        status: status_2,
                        awardedCompany: awardedCompany || null,
                        notes: notes || null,
                        updatedAt: new Date(),
                    })
                        .where((0, drizzle_orm_1.eq)(schema_1.tenders.id, tenderId))
                        .returning()];
            case 2:
                updatedTender = (_b.sent())[0];
                return [4 /*yield*/, db_1.db.insert(schema_1.auditLogs).values({
                        tenderId: tenderId,
                        userId: req.userId,
                        action: "update",
                        changes: JSON.stringify({ before: existingTender, after: updatedTender }),
                    })];
            case 3:
                _b.sent();
                res.json(updatedTender);
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.error("Error updating tender:", error_4);
                res.status(500).json({ error: "Failed to update tender" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.delete("/:id", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenderId, existingTender, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                tenderId = parseInt(req.params.id);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.tenders)
                        .where((0, drizzle_orm_1.eq)(schema_1.tenders.id, tenderId))
                        .limit(1)];
            case 1:
                existingTender = (_a.sent())[0];
                if (!existingTender) {
                    return [2 /*return*/, res.status(404).json({ error: "Tender not found" })];
                }
                return [4 /*yield*/, db_1.db.insert(schema_1.auditLogs).values({
                        tenderId: tenderId,
                        userId: req.userId,
                        action: "delete",
                        changes: JSON.stringify({ tender: existingTender }),
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, db_1.db.delete(schema_1.tenders).where((0, drizzle_orm_1.eq)(schema_1.tenders.id, tenderId))];
            case 3:
                _a.sent();
                res.json({ message: "Tender deleted successfully" });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error("Error deleting tender:", error_5);
                res.status(500).json({ error: "Failed to delete tender" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
