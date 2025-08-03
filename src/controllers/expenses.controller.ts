import { Request, Response } from "express";
import { z } from "zod";
import { fetchCategoryRules, fetchExpenses } from "../services/expenses.service";
import { DefaultRouteBuilder } from "../core/default.router";

const expenseSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  category: z.string().nullable().optional()
});

let expensesInMemory: any[] = [];

export function simulateImport(req: Request, res: Response) {
  const userId = (req as any).userId;
  const data = req.body;

}


export function addExpense(req: Request, res: Response) {
  const userId = (req as any).userId;
  const parsed = expenseSchema.safeParse(req.body);
  
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  parsed.data;
}

function importExpenses(req: Request, res: Response): any {
  const userId = (req as any).userId;
  const data = req.body;

  if (!Array.isArray(data)) return res.status(400).json({ error: "Expected array" });

  const validated = data.map((item, idx) => {
    const result = expenseSchema.safeParse(item);
    if (!result.success) {
      throw new Error(`Invalid expense at index ${idx}`);
    }
    return { ...result.data, userId };
  });

  expensesInMemory.push(...validated);
  res.status(201).json({ imported: validated.length });
}

async function getExpenses(req: Request, res: Response) {
    const userId = (req as any).userId;
    const userExpenses = await fetchExpenses({ id: userId });

    res.json(userExpenses);
}

async function listRules(req: Request, res: Response) {
    const categorieRules = await fetchCategoryRules();

    res.json(categorieRules);
}


async function listCategories(req: Request, res: Response) {
    const userId = (req as any).userId;
    const categories = new Set<string>();
    const categorieRules = await fetchCategoryRules();

    categorieRules.forEach(rule => {
        if (rule.category && rule.category !== "") {
            categories.add(rule.category);
        }
    });
    
    res.json(Array.from(categories));
}

const router = new DefaultRouteBuilder("/expenses")
  .addPost("/import", importExpenses)
  .addRoute('GET',"/", getExpenses)
  .addGet("/categories", listCategories)
  .addGet("/rules", listRules)
  .addPost("/simulate", simulateImport)
  .build();

export default router;