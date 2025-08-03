import { CategoryRule } from "../services/expenses.service";

export function matchCategory(description: string, rules: CategoryRule[]): string | null {
  const upper = description.toUpperCase();
  for (const rule of rules) {
    if (upper.includes(rule.category.toUpperCase())) {
      if (rule.action === "ignore") return "ignore";

      return rule.category;
    } 
  }
  return null;
}