import dotenv from "dotenv";
dotenv.config();

export const {
  PORT,
  SERVER_URL,
  MONGO_URI,
  ARCJET_KEY,
  EMAIL,
  PASSWORD,
  JWT_ACTIVATE,
} = process.env;
