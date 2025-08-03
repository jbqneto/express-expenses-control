import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { findOrCreateUser } from "../services/user.service";

const client = new OAuth2Client();

export async function googleAuthController(req: Request, res: Response) {
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ error: "Missing id_token" });

  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  const user = await findOrCreateUser({
    googleId: payload.sub!,
    email: payload.email!,
    name: payload.name || "Unknown"
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d"
  });

  res.json({ token });
}
