import { body, validationResult } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
];

export const emailValidator = [
  body("email").isEmail().withMessage("Enter a valid email"),
];

export const passwordValidator = [
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
];

export const passwordPresenceValidator = body(
  "password",
  "Password is required"
).notEmpty();

export const advertisementValidator = [
  body("description").trim().escape(),
  body("phoneNumber").trim().escape(),
  body("price").trim().escape(),
];

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
