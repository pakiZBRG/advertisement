import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { advertisementValidator } from "../middleware/validation.middleware.js";
import {
  createAdvertisement,
  deleteAdvertisement,
  getAdvertisement,
  getDatedAdvertisements,
  updateAdvertisement,
} from "../controllers/advertisements.controller.js";

const advertisementRouter = Router();

advertisementRouter.get("/date", authorize, getDatedAdvertisements);

advertisementRouter.get("/:id", authorize, getAdvertisement);

advertisementRouter.post(
  "/",
  authorize,
  advertisementValidator,
  createAdvertisement
);

advertisementRouter.put("/:id", authorize, updateAdvertisement);

advertisementRouter.delete("/:id", authorize, deleteAdvertisement);

export default advertisementRouter;
