import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    // Used for activation and password reset
    jwtToken: {
      type: String,
    },
    // After logging in store the token for 7 days (or until log out) for refreshing the 15min access token
    refreshToken: {
      type: String,
    },
    // Used in URLs for activation and password reset instead of exposing JWT
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
