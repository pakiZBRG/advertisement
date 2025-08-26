import { Router } from "express";

import {
  activate,
  register,
  resentActivation,
  forgotPassword,
  resetPassword,
  login,
  logout,
  refreshToken,
  sendMessage,
  googleLogin,
} from "../controllers/auth.controller.js";

import {
  emailValidator,
  handleValidation,
  passwordValidator,
  registerValidator,
} from "../middleware/validation.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, handleValidation, register);

authRouter.put("/activate/:token", activate);

authRouter.post(
  "/resend-activation",
  emailValidator,
  handleValidation,
  resentActivation
);

authRouter.post(
  "/forgot-password",
  emailValidator,
  handleValidation,
  forgotPassword
);

authRouter.post(
  "/reset-password/:token",
  passwordValidator,
  handleValidation,
  resetPassword
);

authRouter.post("/login", emailValidator, handleValidation, login);

authRouter.post("/google", googleLogin);

authRouter.post("/logout", logout);

authRouter.post("/refresh", refreshToken);

authRouter.post("/send-message", sendMessage);

export default authRouter;
