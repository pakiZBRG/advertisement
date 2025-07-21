import { Router } from "express";

import {
  activate,
  register,
  resentActivation,
  signIn,
  deleteUser,
  getUser,
  getUserAds,
  updateUser,
} from "../controllers/users.controller.js";

import {
  activationValidator,
  handleValidation,
  registerValidator,
} from "../middleware/validation.middleware.js";

const userRouter = Router();

userRouter.post("/", registerValidator, handleValidation, register);

userRouter.put("/activate/:token", activate);

userRouter.post(
  "/resend-activation",
  activationValidator,
  handleValidation,
  resentActivation
);

userRouter.post("/signin", signIn);

userRouter.get("/:id", getUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

userRouter.get("/user-ads", getUserAds);

export default userRouter;
