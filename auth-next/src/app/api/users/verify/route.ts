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
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;

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
