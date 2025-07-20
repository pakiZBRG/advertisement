import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUserAds,
  register,
  signIn,
  updateUser,
} from "../controllers/users.controller";

const router = Router();

router.post("/register", register);

router.post("/sign-in", signIn);

router.get("/:id", getUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.get("/user-ads", getUserAds);
