import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NODE_ENV) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "NODE_ENV is required",
      });
    }

    const response = NextResponse.json({
      success: true,
      status: 200,
      message: "Logout Successfully",
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Error in logging out: ", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error in logging out",
      data: error,
    });
  }
}
