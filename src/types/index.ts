import { CategoryRule } from "../services/expenses.service";

export type Expense = {
  category: string | null;
  description: string;
  amount: number;
  date: string;
};

export type RuleSet = {
  rules: CategoryRule[];
  defaultCategory: string;
};

export type ImportType = "standard" | "millennium" | "revolut";