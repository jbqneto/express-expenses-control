import * as xlsx from "xlsx";
import * as fs from "fs";
import * as Papa from 'papaparse';
import { Expense } from "../types";
import { matchCategory } from "./category-matcher";
import { CategoryRule, fetchCategoryRules } from "../services/expenses.service";



export function loadPredefinedRules(path: string = ''): Promise<CategoryRule[]> {
    return fetchCategoryRules() ; 
}

export function importStandardExcel(buffer: Buffer, rules: CategoryRule[]): Expense[] {
  const workbook = xlsx.read(buffer);
  const sheet = xlsx.utils.sheet_to_json<any>(workbook.Sheets["Gastos"]);
  return sheet.map(row => ({
    category: matchCategory(row["Obs"], rules),
    description: row["Descrição"] || "",
    amount: parseFloat(String(row["Valor"]).replace(",", ".")),
    date: new Date(row["Data"]).toISOString().split("T")[0]
  }));
}

export function importMillenniumCsv(buffer: Buffer, rules: CategoryRule[]): Expense[] {
  const raw = buffer.toString("utf16le").replace(/\x00/g, "");
  const lines = raw.split("\n").slice(12);
  const csv = Papa.parse(lines.join("\n"), { header: true, delimiter: ";" });
  return (csv.data as any[]).map(row => ({
    category: matchCategory(row["Descrição"], rules),
    description: row["Descrição"],
    amount: Math.abs(parseFloat(row["Montante"].replace(",", "."))),
    date: new Date(row["Data lançamento"].replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')).toISOString().split("T")[0]
  }));
}

export function importRevolutCsv(buffer: Buffer, rules: CategoryRule[]): Expense[] {
  const raw = buffer.toString("utf-8");
  const csv = Papa.parse(raw, { header: true });
  return (csv.data as any[]).map(row => ({
    category: matchCategory(row["Description"], rules),
    description: row["Description"],
    amount: Math.abs(parseFloat(row["Amount"])),
    date: new Date(row["Started Date"]).toISOString().split("T")[0]
  }))
}
