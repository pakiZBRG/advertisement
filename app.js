import express from "express";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";

import { PORT } from "./config/env.js";
import connectMongoDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// 1. Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

// 3. Error Handling
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Server running on port ${chalk.green(PORT)}`);

  await connectMongoDB();
});
