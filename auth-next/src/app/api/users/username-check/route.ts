import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello World from username-check" });
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username } = reqBody;

    if (!username) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Username is required",
      });
    }

    if (username.includes(" ")) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Space not allowed in username",
      });
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Username must be between 3 and 50 characters",
      });
    }

    const user = await User.findOne({ username });

    if (user) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Username already taken",
      });
    }

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Username available",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error checking username",
    });
  }
}
