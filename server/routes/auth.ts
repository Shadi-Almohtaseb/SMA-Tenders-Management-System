import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

const router = express.Router();
const JWT_SECRET = process.env.SESSION_SECRET || "default-secret-key-change-in-production";

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(users)
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
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

export { router as authRouter };
