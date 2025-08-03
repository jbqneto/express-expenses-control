import { Request, Response } from "express";
import { z } from "zod";
import { createUser, findOrCreateUser, findUserByUsername } from "../services/user.service";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { DefaultRouteBuilder } from "../core/default.router";

const client = new OAuth2Client();

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string(),
  password: z.string()
});

export class UserController {
  
  public async createUser(req: Request, res: Response) {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    try {
      const user = await createUser(parsed.data);
      res.status(201).json({ id: user.id, username: user.email });
    } catch (err) {
      res.status(400).json({ error: "Username or email already exists." });
    }
  }

  public async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) return res.status(400).json(parsed.error.format());

    const user = await findUserByUsername(parsed.data.email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d"
    });

    res.json({ token });
  }

  public async googleAuth(req: Request, res: Response) {
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
}

const userController = new UserController();

const router = new DefaultRouteBuilder("/users")
  .addPost("/", userController.createUser)
  .addPost("/login", userController.login)
  .build();

export default router;