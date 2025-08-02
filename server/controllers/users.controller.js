import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import sendEmail from "../utils/send-email.js";
import { JWT_SECRET } from "../config/env.js";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const findUserByName = await User.findOne({ username });
    if (findUserByName) {
      return res.status(409).json({ error: "Username is taken" });
    }

    const findUserByEmail = await User.findOne({ email });
    if (findUserByEmail) {
      return res.status(409).json({ error: "Email is taken" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
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
    const findUserByToken = await User.findOne({ token });
    if (!findUserByToken) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const findUser = await User.findOne({ token, verified: false });
    if (!findUser) {
      return res.status(404).json({ error: "User is verified" });
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
        .json({ error: "User is not found or is verified." });
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
      return res.status(404).json({ error: "User is not found." });
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
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const findUserByToken = await User.findOne({ token });
    if (!findUserByToken) {
      return res.status(404).json({ error: "Token has expired" });
    }

    const findUser = await User.findOne({ token, verified: true });
    if (!findUser) {
      return res.status(404).json({ error: "User is not found" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
      return res.status(404).json({ error: "Wrong credentials" });
    }

    const validPassword = await bcrypt.compare(password, findUser.password);
    if (!validPassword)
      return res.status(409).json({ error: "Wrong Credentials" });

    const accessToken = jwt.sign({ userId: findUser._id }, JWT_SECRET, {
      expiresIn: 900,
    });
    const refreshToken = jwt.sign({ userId: findUser._id }, JWT_SECRET, {
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
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict", // Or "Lax"/"None" based on setup
        maxAge: 15 * 60 * 1000, // 15 mins
      })
      .json({ message: "Welcome!" });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const logout = async (req, res, next) => {
  const { userId } = req.body.user;

  try {
    await User.findByIdAndUpdate(userId, { $set: { refreshToken: "" } });

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logged out! See you soon." });
  } catch (error) {
    next(error);
  }
};

export const isUserAuth = async (req, res, next) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
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

    const findUser = await User.findById(id);
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

export const getUserAds = async (req, res, next) => {};
