import { Request, Response } from "express";
import { processImportFile } from '../services/import.service';
import { z } from "zod";

const paramsSchema = z.object({
  type: z.enum(["standard", "millennium", "revolut"])
});

export async function importFileController(req: Request, res: Response) {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) return res.status(400).send("Invalid type parameter");
  if (!req.file || !req.file.buffer) return res.status(400).send("File not uploaded or invalid format");

   const token = req.headers.authorization?.split(" ")[1];

   if (!token) return res.status(401).json({ error: "Missing or invalid token" });

    const userId = (req as any).userId; // Assuming userId is set in the middleware

    const data = await processImportFile(userId, parsed.data.type, req.file.buffer);
  
    res.json(data);
}