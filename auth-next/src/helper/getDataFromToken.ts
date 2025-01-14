"use server";

import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

type DecodedToken = {
  id: string;
  isAdmin: boolean;
  isVerified: boolean;
};

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Token is required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "JWT_SECRET is required",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as DecodedToken;

    return decodedToken.id;
  } catch (error) {
    console.error("Error in getting data from token: ", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error in getting data from token",
      data: error,
    });
  }
};
