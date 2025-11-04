import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { tendersRouter } from "./routes/tenders";
import { authRouter } from "./routes/auth";
import { auditRouter } from "./routes/audit";
import { attachmentsRouter } from "./routes/attachments";
import { notificationsRouter } from "./routes/notifications";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tenders", tendersRouter);
app.use("/api/audit", auditRouter);
app.use("/api/attachments", attachmentsRouter);
app.use("/api/notifications", notificationsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
