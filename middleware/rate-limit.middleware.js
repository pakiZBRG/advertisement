import chalk from "chalk";
import rateLimit from "../config/rate-limit.js";

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const decision = await rateLimit.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bot activity detected" });
      }
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }

      return res.status(403).json({ error: "Access denied" });
    }
  } catch (error) {
    console.log(`Arcjet Middleware ${chalk.red("Error")}: ${error}`);
    next(error);
  }
};

export default rateLimitMiddleware;
