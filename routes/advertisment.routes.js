import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { advertismentValidator } from "../middleware/validation.middleware.js";
import {
  createAdvertisment,
  deleteAdvertisment,
  getAdvertisment,
  getWeaklyAdvertisments,
  updateAdvertisment,
} from "../controllers/advertisments.controller.js";

const advertismentRouter = Router();

advertismentRouter.get("/:id", authorize, getAdvertisment);

advertismentRouter.post(
  "/",
  authorize,
  advertismentValidator,
  createAdvertisment
);

advertismentRouter.put("/:id", authorize, updateAdvertisment);

advertismentRouter.delete("/:id", authorize, deleteAdvertisment);

advertismentRouter.get("/weekly", getWeaklyAdvertisments);

export default advertismentRouter;
