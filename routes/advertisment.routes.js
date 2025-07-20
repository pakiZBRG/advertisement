import { Router } from "express";
import {
  createAdvertisment,
  deleteAdvertisment,
  getAdvertisment,
  getAdvertisments,
  getWeaklyAdvertisments,
  updateAdvertisment,
} from "../controllers/advertisments.controller.js";

const router = Router();

router.get("/", getAdvertisments);

router.get("/:id", getAdvertisment);

router.post("/", createAdvertisment);

router.put("/:id", updateAdvertisment);

router.delete("/:id", deleteAdvertisment);

router.get("/weekly", getWeaklyAdvertisments);
