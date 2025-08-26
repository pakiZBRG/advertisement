import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.model.js";
import sendEmail from "../utils/send-email.js";
import { GOOGLE_CLIENT_ID, JWT_SECRET } from "../config/env.js";
import { v4 as uuidv4 } from "uuid";
import Advertisement from "../models/Advertisement.model.js";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

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
      { $set: { token: "", jwtToken: "", verified: true } }
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

    await User.updateOne({ _id: findUser._id }, { $set: { jwtToken } });
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

    await User.updateOne({ email }, { $set: { token, jwtToken } });
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
      { $set: { token: "", jwtToken: "", password: hashedPassword } }
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Wrong credentials" });
    }

    if (user.google && user.password === null) {
      return res.status(200).json({
        message:
          "This account was created with Google Login. Please click on Forgot Password? to set your password or login with Google.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(409).json({ error: "Wrong Credentials" });

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: 900,
    });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "14d",
    });

    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await User.updateOne(
      { email },
      { $set: { refreshToken: hashedRefreshToken } }
    );

    await session.commitTransaction();

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true, // 🔒 Can't be accessed by JS
        secure: true, // 🔐 Only over HTTPS
        sameSite: "Strict", // 🚫 Prevent CSRF (depending on use case)
        maxAge: 14 * 24 * 60 * 60 * 1000, // 10 days
      })
      .json({ message: "Welcome!", user: user._id, accessToken });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const googleLogin = async (req, res, next) => {
  const { token } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    const findUser = await User.findOne({ email });
    let accessToken, refreshToken;

    if (findUser) {
      accessToken = jwt.sign({ userId: findUser._id }, JWT_SECRET, {
        expiresIn: 900,
      });
      refreshToken = jwt.sign({ userId: findUser._id }, JWT_SECRET, {
        expiresIn: "14d",
      });
    } else {
      const user = new User({
        username: name,
        email,
        google: true,
        verified: true,
      });
      await user.save({ session });

      accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: 900,
      });
      refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "14d",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await User.updateOne(
      { email },
      { $set: { refreshToken: hashedRefreshToken } }
    );
    await session.commitTransaction();

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true, // 🔒 Can't be accessed by JS
        secure: true, // 🔐 Only over HTTPS
        sameSite: "Strict", // 🚫 Prevent CSRF (depending on use case)
        maxAge: 14 * 24 * 60 * 60 * 1000, // 10 days
      })
      .json({ message: "Welcome!", user: findUser._id, accessToken });
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

export const refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const verify = jwt.verify(token, JWT_SECRET);

    const accessToken = jwt.sign({ userId: verify.userId }, JWT_SECRET, {
      expiresIn: 900,
    });

    return res.status(200).json({ accessToken, userId: verify.userId });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  const { name, email, message } = req.body;

  console.log(req.body);

  try {
    await sendEmail(
      { email, name, message },
      `New message from ${name}`,
      "sendMessage"
    );

    return res.status(200).json({ message: "Message has been sent" });
  } catch (err) {
    next(err);
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

export const getUserAds = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select(
      "-password -refreshToken -token -jwtToken"
    );
    const advertisements = await Advertisement.find({ user: id });

    return res.status(200).json({ advertisements, user });
  } catch (err) {
    next(err);
  }
};
