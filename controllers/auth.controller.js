import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import sendEmail from "../utils/send-email.js";
import { JWT_ACTIVATE } from "../config/env.js";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const findUserByName = await User.findOne({ username });
    if (findUserByName) {
      return res.status(409).json({ message: "Username is taken" });
    }

    const findUserByEmail = await User.findOne({ email });
    if (findUserByEmail) {
      return res.status(409).json({ message: "Email is taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = uuidv4();
    const jwtActivation = jwt.sign({ token }, JWT_ACTIVATE, { expiresIn: 600 });

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      jwtActivation,
      token,
    });
    await newUser.save({ session });

    await session.commitTransaction();

    await sendEmail(email, token);

    res.status(201).json({
      message: "Email for user activation has been sent",
      data: { user: newUser },
    });
  } catch (error) {
    next(error);
  }
};

export const activate = async (req, res, next) => {};

export const signIn = async (req, res, next) => {};
