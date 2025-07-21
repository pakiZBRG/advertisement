import { body, validationResult } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters"),
  body("email").toLowerCase().isEmail().withMessage("Enter a valid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
];

export const activationValidator = [
  body("email").toLowerCase().isEmail().withMessage("Enter a valid email"),
];

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
