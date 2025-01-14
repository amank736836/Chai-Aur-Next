import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username already exists"],
    lowercase: [true, "Username must be in lowercase"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
    lowercase: [true, "Email must be in lowercase"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: {
    type: String,
    default: null,
  },
  forgotPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
  verifyToken: {
    type: String,
    default: null,
  },
  verifyTokenExpiry: {
    type: Date,
    default: null,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
