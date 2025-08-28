import mongoose from "mongoose";

import User from "../models/User.model.js";
import Advertisement from "../models/Advertisement.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select(
      "-password -refreshToken -token -jwtToken"
    );
    return res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const findUser = await User.findById(id).select(
      "-password -refreshToken -token -jwtToken"
    );
    if (!findUser) {
      return res.status(404).json({ error: "User is not found." });
    }

    return res.status(200).json({ data: findUser });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { username, email } = req.body;
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const findUser = await User.findById(id);
    if (!findUser) return res.status(404).json({ error: "User is not found" });

    if (findUser._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not allowed to update other users." });
    }

    await User.findByIdAndUpdate(id, { username, email });

    await session.commitTransaction();

    return res.status(200).json({ message: "User has been updated" });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const findUser = await User.findById(id);
    if (!findUser) return res.status(404).json({ error: "User is not found" });

    if (findUser._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete other users." });
    }

    await User.findByIdAndDelete(id);

    await session.commitTransaction();

    return res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const getUserAds = async (req, res, next) => {
  const { userId } = req.params;
  const { last } = req.query;
  const limit = 10;

  const query = last ? { _id: { $lt: last }, user: userId } : { user: userId };

  try {
    const user = await User.findById(userId).select(
      "-password -refreshToken -token -jwtToken"
    );
    const advertisements = await Advertisement.find(query)
      .sort({ _id: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({ advertisements, user });
  } catch (err) {
    next(err);
  }
};
