import { resend } from "@/config/resend-email";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../../types/api-response";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Email Verification Code",
      react: VerificationEmail({ username, verificationCode: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email send successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
