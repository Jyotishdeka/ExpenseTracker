import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});


///route imports
import userRouter from "./routes/user.routes.js"
import categoryRouter from "./routes/category.routes.js"
import budgetRouter from "./routes/budget.routes.js"
import transactionRouter from "./routes/transaction.routes.js"

 app.use("/api/v1/users", userRouter)
 app.use("/api/v1/categories", categoryRouter)
 app.use("/api/v1/budgets", budgetRouter)
 app.use("/api/v1/transactions", transactionRouter)

export { app };
