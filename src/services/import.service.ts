import { Expense } from "../types";
import {
  importStandardExcel,
  importMillenniumCsv,
  importRevolutCsv,
  loadPredefinedRules
} from "../utils/file-loader";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function processImportFile(userId: number, type: string, buffer: Buffer): Promise<Expense[]> {
  
  const rules = await loadPredefinedRules();

  switch (type) {
    case "standard":
      return importStandardExcel(buffer, rules);
    case "millennium":
      return importMillenniumCsv(buffer, rules);
    case "revolut":
      return importRevolutCsv(buffer, rules);
    default:
      throw new Error("Unsupported import type");
  }
  
}