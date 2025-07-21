import { Router } from "express";
import {
  createAdvertisment,
  deleteAdvertisment,
  getAdvertisment,
  getAdvertisments,
  getWeaklyAdvertisments,
  updateAdvertisment,
} from "../controllers/advertisments.controller.js";

const advertismentRouter = Router();

advertismentRouter.get("/", getAdvertisments);

advertismentRouter.get("/:id", getAdvertisment);

advertismentRouter.post("/", createAdvertisment);

advertismentRouter.put("/:id", updateAdvertisment);

advertismentRouter.delete("/:id", deleteAdvertisment);

advertismentRouter.get("/weekly", getWeaklyAdvertisments);

export default advertismentRouter;
