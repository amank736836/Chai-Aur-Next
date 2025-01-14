import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

import { verifyEmail } from "@/helper/mailer";
import bcryptjs from "bcryptjs";

connect();

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello World from signup" });
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Username is required",
      });
    }

    if (!email) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Email is required",
      });
    }

    if (!password) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Password is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "User already exists with this email",
      });
    }

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(password, salt);

    const users = await User.find();

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: users.length === 0 ? true : false,
      isVerified: users.length === 0 ? true : false,
    });

    const savedUser = await newUser.save();

    // send verification email

    if (users.length !== 0) {
      await verifyEmail({
        email,
        userId: savedUser._id,
      });
    }

    return NextResponse.json({
      success: true,
      status: 200,
      message: "User registered successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error("Error in signup: ", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error in signup",
      data: error,
    });
  }
}
