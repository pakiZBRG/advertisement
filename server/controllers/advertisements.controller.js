import mongoose from "mongoose";
import Advertisement from "../models/Advertisement.model.js";

export const getAdvertisement = async (req, res, next) => {
  const { id } = req.params;

  try {
    const advertisement = await Advertisement.findById(id);
    if (!advertisement)
      return res.status(404).json({ error: "Advertisement is not found." });

    return res.status(200).json({ data: advertisement });
  } catch (error) {
    next(error);
  }
};

export const createAdvertisement = async (req, res, next) => {
  const { description, phoneNumber, price, user } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const advertisement = new Advertisement({
      description,
      phoneNumber,
      price,
      user,
    });

    await advertisement.save({ session });

    await session.commitTransaction();

    res.status(201).json({ message: "Advertisement created" });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateAdvertisement = async (req, res, next) => {
  const { description, phoneNumber, price } = req.body;
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const advertisement = await Advertisement.findById(id);
    if (!advertisement)
      return res.status(404).json({ error: "Advertisement is not found" });

    if (advertisement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "You are not allowed to update other's advertisements.",
      });
    }

    await Advertisement.findByIdAndUpdate(id, {
      description,
      phoneNumber,
      price,
    });

    await session.commitTransaction();

    return res.status(200).json({ message: "Advertisement has been updated" });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const deleteAdvertisement = async (req, res, next) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const advertisement = await Advertisement.findById(id);
    if (!advertisement)
      return res.status(404).json({ error: "Advertisement is not found" });

    if (advertisement.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        error: "You are not allowed to delete other's advertisements.",
      });
    }

    await Advertisement.findByIdAndDelete(id);

    await session.commitTransaction();

    return res.status(200).json({ message: "Advertisement has been deleted" });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const getDatedAdvertisements = async (req, res, next) => {
  const { start, end } = req.query;

  const startDate = new Date(start);
  const endDate = new Date(end + "T23:59:59.999Z"); // include the endDate day

  try {
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const ads = await Advertisement.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    return res.status(200).json({ data: ads });
  } catch (error) {
    next(error);
  }
};
