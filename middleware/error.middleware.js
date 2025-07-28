import chalk from "chalk";

const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    // Mongoose Bad ObjectId
    if (err.name === "CastError") {
      error = new Error("Resource not found");
      console.log(`${chalk.red(err.name)}: ${err.message}`);
      error.statusCode = 404;
    }

    // Moongose duplicate key
    if (err.code === 11000) {
      error = new Error("Duplicate field value entered");
      error.statusCode = 500;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }

    if (err.name === "TokenExpiredError") {
      error = new Error("Activation link expired. Please request a new one.");
      error.status = 410;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
