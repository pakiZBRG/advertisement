import express from "express";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";

import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import advertismentRouter from "./routes/advertisment.routes.js";
import connectMongoDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import rateLimitMiddleware from "./middleware/rate-limit.middleware.js";

const app = express();

// 1. Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(rateLimitMiddleware);

// 2. Route middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/advertisments", advertismentRouter);

// 3. Error Handling Middleware
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Server running on port ${chalk.green(PORT)}`);

  await connectMongoDB();
});
