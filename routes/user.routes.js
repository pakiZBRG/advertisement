import { Router } from "express";

import {
  deleteUser,
  getUser,
  getUserAds,
  updateUser,
} from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.get("/:id", getUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

userRouter.get("/user-ads", getUserAds);

export default userRouter;
