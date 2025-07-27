import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import {
  activate,
  register,
  resentActivation,
  forgotPassword,
  resetPassword,
  login,
  deleteUser,
  getUsers,
  getUser,
  getUserAds,
  updateUser,
} from "../controllers/users.controller.js";

import {
  emailValidator,
  handleValidation,
  passwordPresenceValidator,
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
  passwordPresenceValidator,
  handleValidation,
  login
);

userRouter.get("/", getUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.put("/:id", authorize, updateUser);

userRouter.delete("/:id", authorize, deleteUser);

userRouter.get("/user-ads", authorize, getUserAds);

export default userRouter;
