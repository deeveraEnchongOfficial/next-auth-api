/**
 * This TypeScript function handles fetching user information using the JWT token.
 * @param {Request} req - The `req` parameter is the request object that contains information about the
 * incoming HTTP request, such as headers.
 * @returns The code is returning a NextResponse object. If the JWT token is missing or invalid, it
 * returns a JSON response with a "msg" property set to "Unauthorized" and a status code of 401. If
 * the user is found, it returns a JSON response with the user information and a status code of 200.
 */
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import User from "@/Models/userModels";
import connection from "@/db/config";

export async function GET(req: Request) {
  try {
    // Extract the authorization header from the request
    const authorizationHeader = req.headers.get("authorization");

    if (!authorizationHeader) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    // Extract the JWT token from the authorization header
    const token = authorizationHeader.replace("Bearer ", "");

    // Verify and decode the JWT token
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || "");

    // Connect to the database
    await connection();

    // Fetch the user from the database using the email from the decoded token
    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    // Return the user information as a JSON response
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ msg: "Error fetching user" }, { status: 500 });
  }
}
