import express from "express";
import expenseRoutes from "./controllers/expenses.controller";
import userRoutes from "./controllers/user.controller";
import { requireAuth } from "./middlewares/middleware";

const app = express();

app.use(express.json());
app.use("/expenses", requireAuth, expenseRoutes);
app.use("/users", userRoutes);

export default app;