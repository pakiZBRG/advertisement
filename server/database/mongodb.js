import mongoose from "mongoose";
import chalk from "chalk";

import { MONGO_URI } from "../config/env.js";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log(`Connected to ${chalk.green("database")}`);
  } catch (error) {
    console.log(`Mongo connection ${chalk.bold.red(error)}: ${error}`);
  }
};

export default connectMongoDB;
