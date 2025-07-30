import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const authorize = (req, res, next) => {
  const token = req.cookies.accessToken; // looking for accessToken in the httpOnly Cookies

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

export default authorize;
