import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";
import morgan from "morgan";

import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import advertisementRouter from "./routes/advertisement.routes.js";
import connectMongoDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import rateLimitMiddleware from "./middleware/rate-limit.middleware.js";

const app = express();

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const stream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

// 1. Global middleware
app.use(morgan("common", { stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(rateLimitMiddleware);

// 2. Route middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/advertisements", advertisementRouter);

// 3. Error Handling Middleware
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Server running on port ${chalk.green(PORT)}`);

  await connectMongoDB();
});
