import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUserAds,
  register,
  signIn,
  updateUser,
} from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.post("/sign-in", signIn);

userRouter.get("/:id", getUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

userRouter.get("/user-ads", getUserAds);

export default userRouter;
