import dotenv from "dotenv";
dotenv.config();

export const {
  PORT,
  CLIENT_URL,
  MONGO_URI,
  ARCJET_KEY,
  EMAIL,
  PASSWORD,
  JWT_SECRET,
} = process.env;
