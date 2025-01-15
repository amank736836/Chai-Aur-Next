import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    if (!token) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Token is required",
      });
    }

    const user = await User.findOne({
      verifyToken: token,
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Invalid or expired token",
      });
    }

    if (user.isVerified) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Email already verified",
      });
    }

    const currentTime = new Date();

    if (user.verifyTokenExpiry < currentTime) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Token expired",
      });
    }

    user.isVerified = true;

    await user.save();

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Email verified successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in verifying email: ", error);

    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error in verifying email",
      data: error,
    });
  }
}
