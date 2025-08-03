import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: number };
    (req as any).userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}