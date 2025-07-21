import { Router } from "express";

import {
  activate,
  register,
  resentActivation,
  forgotPassword,
  resetPassword,
  login,
  deleteUser,
  getUser,
  getUserAds,
  updateUser,
} from "../controllers/users.controller.js";

import {
  emailValidator,
  handleValidation,
  passwordValidator,
  registerValidator,
} from "../middleware/validation.middleware.js";

const userRouter = Router();

userRouter.post("/", registerValidator, handleValidation, register);

userRouter.put("/activate/:token", activate);

userRouter.post(
  "/resend-activation",
  emailValidator,
  handleValidation,
  resentActivation
);

userRouter.post(
  "/forgot-password",
  emailValidator,
  handleValidation,
  forgotPassword
);

userRouter.post(
  "/reset-password/:token",
  passwordValidator,
  handleValidation,
  resetPassword
);

userRouter.post(
  "/login",
  emailValidator,
  passwordValidator,
  handleValidation,
  login
);

userRouter.get("/:id", getUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

userRouter.get("/user-ads", getUserAds);

export default userRouter;
