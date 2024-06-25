import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/config/db-connect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const user: User = session.user as User;
  const userId = new mongoose.Types.ObjectId(user._id);
  console.log(`User ID: ${userId}`);

  try {
    // Check if user exists
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    console.log("User exists, proceeding with aggregation...");

    // Aggregation pipeline
    const aggregatedUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!aggregatedUser || aggregatedUser.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No messages found",
        },
        {
          status: 404,
        }
      );
    }

    console.log("Aggregation successful", aggregatedUser);

    return NextResponse.json(
      {
        success: true,
        messages: aggregatedUser[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
