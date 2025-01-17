import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello World from login" });
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { id, password } = reqBody;

    if (!id) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Email or username is required",
      });
    }

    if (!password) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Password is required",
      });
    }

    let user;

    if (id.includes("@")) {
      user = await User.findOne({ email: id });
    } else {
      user = await User.findOne({ username: id });
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "User does not exist with this email/username",
      });
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Invalid password",
      });
    }

    const tokenPayload = {
      id: user._id,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    };

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "JWT_SECRET is required",
      });
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      success: true,
      status: 200,
      message: "Logged in successfully",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error in logging in",
      data: error,
    });
  }
}
