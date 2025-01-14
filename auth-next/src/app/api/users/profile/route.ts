import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello World from profile" });
}

export async function POST(request: NextRequest) {
  const userId = await getDataFromToken(request);

  if (!userId) {
    return NextResponse.json({
      success: false,
      status: 400,
      message: "Invalid token",
    });
  }

  const user = await User.findById(userId).select(
    "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
  );

  console.log("user", user);

  return NextResponse.json({
    success: true,
    status: 200,
    message: "User profile",
    data: user,
  });
}