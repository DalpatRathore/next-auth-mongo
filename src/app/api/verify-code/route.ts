import dbConnect from "@/config/db-connect";
import UserModel from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    // console.log(username)

    const decodedUsername = decodeURIComponent(username);
    // console.log(decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });
    // console.log(user)

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User account verified",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error verifying use code",
      },
      {
        status: 500,
      }
    );
  }
}
