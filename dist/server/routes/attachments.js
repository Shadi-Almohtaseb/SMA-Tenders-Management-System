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
exports.attachmentsRouter = void 0;
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var db_1 = require("../db");
var schema_1 = require("../../shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
exports.attachmentsRouter = router;
var uploadDir = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
var upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});
router.post("/", auth_1.authenticate, upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenderId, attachment, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: "No file uploaded" })];
                }
                tenderId = parseInt(req.body.tenderId);
                if (!tenderId) {
                    return [2 /*return*/, res.status(400).json({ error: "Tender ID is required" })];
                }
                return [4 /*yield*/, db_1.db
                        .insert(schema_1.attachments)
                        .values({
                        tenderId: tenderId,
                        fileName: req.file.originalname,
                        filePath: req.file.path,
                        fileSize: req.file.size,
                        mimeType: req.file.mimetype,
                        uploadedBy: req.userId,
                    })
                        .returning()];
            case 1:
                attachment = (_a.sent())[0];
                res.status(201).json(attachment);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error uploading file:", error_1);
                res.status(500).json({ error: "Failed to upload file" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/tender/:tenderId", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenderId, files, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tenderId = parseInt(req.params.tenderId);
                return [4 /*yield*/, db_1.db.select().from(schema_1.attachments).where((0, drizzle_orm_1.eq)(schema_1.attachments.tenderId, tenderId))];
            case 1:
                files = _a.sent();
                res.json(files);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching attachments:", error_2);
                res.status(500).json({ error: "Failed to fetch attachments" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/:id/download", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var attachment, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.attachments)
                        .where((0, drizzle_orm_1.eq)(schema_1.attachments.id, parseInt(req.params.id)))
                        .limit(1)];
            case 1:
                attachment = (_a.sent())[0];
                if (!attachment) {
                    return [2 /*return*/, res.status(404).json({ error: "File not found" })];
                }
                res.download(attachment.filePath, attachment.fileName);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error downloading file:", error_3);
                res.status(500).json({ error: "Failed to download file" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete("/:id", auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var attachment, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.attachments)
                        .where((0, drizzle_orm_1.eq)(schema_1.attachments.id, parseInt(req.params.id)))
                        .limit(1)];
            case 1:
                attachment = (_a.sent())[0];
                if (!attachment) {
                    return [2 /*return*/, res.status(404).json({ error: "File not found" })];
                }
                if (fs_1.default.existsSync(attachment.filePath)) {
                    fs_1.default.unlinkSync(attachment.filePath);
                }
                return [4 /*yield*/, db_1.db.delete(schema_1.attachments).where((0, drizzle_orm_1.eq)(schema_1.attachments.id, parseInt(req.params.id)))];
            case 2:
                _a.sent();
                res.json({ message: "File deleted successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error deleting file:", error_4);
                res.status(500).json({ error: "Failed to delete file" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
