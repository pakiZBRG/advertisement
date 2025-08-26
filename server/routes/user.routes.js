import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import {
  deleteUser,
  getUsers,
  getUser,
  getUserAds,
  updateUser,
} from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.put("/:id", authorize, updateUser);

userRouter.delete("/:id", authorize, deleteUser);

userRouter.get("/user-ads/:id", authorize, getUserAds);

export default userRouter;
