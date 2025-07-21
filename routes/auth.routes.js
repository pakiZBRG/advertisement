import { Router } from "express";
import {
  handleValidation,
  registerValidator,
} from "../middleware/validation.middleware.js";
import { activate, register, signIn } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, handleValidation, register);

authRouter.patch("/acivate", activate);

authRouter.post("/sign-in", signIn);

export default authRouter;
