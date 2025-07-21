import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import sendEmail from "../utils/send-email.js";
import { JWT_SECRET } from "../config/env.js";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
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
    const jwtToken = jwt.sign({ token }, JWT_SECRET, { expiresIn: 600 });

    const user = new User({
      username,
      email,
      password: hashedPassword,
      jwtToken,
      token,
    });
    await user.save({ session });

    await session.commitTransaction();

    await sendEmail({ email, token }, "Account activation link", "activate");

    res.status(201).json({
      message: "Email for user activation has been sent",
      data: { user },
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const activate = async (req, res, next) => {
  const { token } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const findUser = await User.findOne({ token, verified: false });
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "User doesn't exist or is verified" });
    }

    const verify = jwt.verify(findUser.jwtToken, JWT_SECRET);
    await User.updateOne(
      { token: verify.token },
      {
        token: "",
        jwtToken: "",
        verified: true,
      }
    );

    await session.commitTransaction();

    res.status(200).json({
      message: "User has been verified. Welcome!",
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const resentActivation = async (req, res, next) => {
  const { email } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const findUser = await User.findOne({ email, verified: false });
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "User is not found or is verified." });
    }

    const jwtToken = jwt.sign({ token: findUser.token }, JWT_SECRET, {
      expiresIn: 600,
    });

    await User.updateOne({ _id: findUser._id }, { jwtToken });
    await session.commitTransaction();

    await sendEmail(
      { email, token: findUser.token },
      "Resend activation link",
      "activation"
    );

    res.status(200).json({
      message: "Email for user activation has been resent",
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "User is not found." });
    }

    const token = uuidv4();
    const jwtToken = jwt.sign({ token }, JWT_SECRET, { expiresIn: 600 });

    await User.updateOne({ email }, { token, jwtToken });
    await session.commitTransaction();

    await sendEmail({ email, token }, "Reset password", "reset");

    res.status(200).json({
      message: "Reset password link has been sent to your email",
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const findUser = await User.findOne({ token, verified: true });
    if (!findUser) {
      return res.status(404).json({ message: "User is not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(findUser.password, salt);

    const verify = jwt.verify(findUser.jwtToken, JWT_SECRET);
    await User.updateOne(
      { token: verify.token },
      {
        token: "",
        jwtToken: "",
        password: hashedPassword,
      }
    );

    await session.commitTransaction();

    res.status(200).json({
      message: "Password has been successfully reseted.",
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "Wrong credentials" });
    }

    const validPassword = await bcrypt.compare(password, findUser.password);
    if (!validPassword)
      return res.status(409).json({ error: "Wrong Credentials" });

    const accessToken = jwt.sign({ _id: findUser._id }, JWT_SECRET, {
      expiresIn: 600,
    });
    const refreshToken = jwt.sign({ _id: findUser._id }, JWT_SECRET, {
      expiresIn: "10d",
    });

    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await User.updateOne({ email }, { refreshToken: hashedRefreshToken });

    await session.commitTransaction();

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true, // 🔒 Can't be accessed by JS
        secure: true, // 🔐 Only over HTTPS
        sameSite: "Strict", // 🚫 Prevent CSRF (depending on use case)
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      })
      .json({
        message: "Successful login",
        token: accessToken,
      });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const getUser = async (req, res, next) => {};

export const updateUser = async (req, res, next) => {};

export const deleteUser = async (req, res, next) => {};

export const getUserAds = async (req, res, next) => {};
