import mongoose from "mongoose";
import Advertisment from "../models/Advertisment.model.js";

export const getAdvertisments = async (req, res, next) => {};

export const getAdvertisment = async (req, res, next) => {};

export const createAdvertisment = async (req, res, next) => {
  const { description, phoneNumber, price } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const advertisment = new Advertisment({
      description,
      phoneNumber,
      price,
      user: req.user.id,
    });

    await advertisment.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: "Advertisment created",
      data: { advertisment },
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateAdvertisment = async (req, res, next) => {};

export const deleteAdvertisment = async (req, res, next) => {};

export const getWeaklyAdvertisments = async (req, res, next) => {};
