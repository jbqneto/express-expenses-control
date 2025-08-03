import { User } from "@prisma/client";
import axios from "axios";
import { url } from "inspector";
import { Expense } from "../types";

export interface CategoryRule {
  name: string;
  category: string;
  action: string;
}

const BASE_URL = process.env.N8N_URL;
const URL_CATEGORIES = "/expenses/categories/my";
const URL_EXPENSES = "/expenses/my";

export async function fetchCategoryRules(): Promise<CategoryRule[]> {
  try {
    const requestData = getBasicRequestData();
    const fullUrl = `${requestData.url}${URL_CATEGORIES}`;
    
    const response = await axios.get(fullUrl, {
      auth: {
        username: requestData.auth.username,
        password: requestData.auth.password
      }
    });

    return response.data;
  } catch (err) {
    console.error("Failed to fetch category rules:", err);
    return [];
  }
}

export async function fetchExpenses(user: Pick<User, 'id'>): Promise<Expense[]> {
    const requestData = getBasicRequestData();
    const fullUrl = `${requestData.url}${URL_EXPENSES}`;
    
    const response = await axios.get(fullUrl, {
      auth: {
        username: requestData.auth.username,
        password: requestData.auth.password
      }
    });

    return response.data;
}

function getBasicRequestData() {
  const username = process.env.N8N_BASIC_AUTH_USER;
  const password = process.env.N8N_BASIC_AUTH_PASSWORD;
  const url = process.env.N8N_URL;

  if (!url) {
    throw new Error("N8N_URL environment variable is not set");
  }
  
  if (!username || !password) {
    throw new Error("N8N AUTH variables are not set");
  }

  return {
    url,       
    auth: {
      username,
      password
    }
  };
}