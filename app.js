import express from "express";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";

import { PORT } from "./config/env.js";
import { connectMongoDB } from "./database/mongodb.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

app.listen(PORT, async () => {
  console.log(`Server running on port ${chalk.green(PORT)}`);

  await connectMongoDB();
});
