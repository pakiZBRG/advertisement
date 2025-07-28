import mongoose from "mongoose";
import Advertisment from "../models/Advertisment.model.js";

export const getAdvertisment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const advertisment = await Advertisment.findById(id);
    if (!advertisment)
      return res.status(404).json({ message: "Advertisment is not found." });

    return res.status(200).json({ data: advertisment });
  } catch (error) {
    next(error);
  }
};

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

export const updateAdvertisment = async (req, res, next) => {
  const { description, phoneNumber, price } = req.body;
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const advertisment = await Advertisment.findById(id);
    if (!advertisment)
      return res.status(404).json({ message: "Advertisment is not found" });

    if (advertisment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update other's advertisments.",
      });
    }

    await Advertisment.findByIdAndUpdate(id, {
      description,
      phoneNumber,
      price,
    });

    await session.commitTransaction();

    return res.status(200).json({ message: "Advertisment has been updated" });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const deleteAdvertisment = async (req, res, next) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const advertisment = await Advertisment.findById(id);
    if (!advertisment)
      return res.status(404).json({ message: "Advertisment is not found" });

    if (advertisment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete other's advertisments.",
      });
    }

    await Advertisment.findByIdAndDelete(id);

    await session.commitTransaction();

    return res.status(200).json({ message: "Advertisment has been deleted" });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const getWeaklyAdvertisments = async (req, res, next) => {};
