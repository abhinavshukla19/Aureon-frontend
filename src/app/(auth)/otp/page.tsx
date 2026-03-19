"use client";
import "./otp.css";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/components/alert/alert";
import axios from "axios";

// inner component that uses useSearchParams
const OtpInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError, showWarning } = useAlert();

  const email = searchParams.get("email") || "";
  const purpose = searchParams.get("purpose") || "signup";
  const newPassword = searchParams.get("newPassword") || undefined;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // redirect if no email in URL
  useEffect(() => {
    if (!email) {
      showError("No email found. Please try again.", "Error");
      setTimeout(() => {
        if (purpose === "password_change" || purpose === "email_change") {
          router.push("/settings");
        } else {
          router.push("/signup");
        }
      }, 1500);
    }
  }, [email, purpose, router, showError]);

  // resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      showWarning("Please enter a valid 6-digit OTP", "Validation Error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/api/otpverify", {
        email,
        otp,
        purpose,
        ...(purpose === "password_change" && newPassword ? { newPassword } : {}),
      });

      if (res.data.success) {
        const successMessages: Record<string, string> = {
          signup: "Email verified! Welcome to Aureon!",
          signin: "Signed in successfully!",
          password_change: "Password changed successfully!",
          email_change: `Email changed to ${res.data.newEmail || "new email"}!`,
        };

        showSuccess(successMessages[purpose] || "OTP verified!", "Success");

        setTimeout(() => {
          if (purpose === "signup" || purpose === "signin") {
            router.push("/");
          } else {
            router.push("/settings");
          }
        }, 1500);
      } else {
        showError(res.data.message || "Verification failed", "Error");
        setIsLoading(false);
      }

    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong. Please try again.";
      showError(message, "Verification Failed");
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);

    try {
      const res = await axios.post("/api/resend-otp", { email, purpose });

      if (res.data.success) {
        showSuccess("OTP sent! Check your email.", "Sent");
        setResendCooldown(60);
      } else {
        showError(res.data.message || "Failed to resend OTP", "Error");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to resend OTP";
      showError(message, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && otp.length === 6 && !isLoading) {
      verifyOTP();
    }
  };

  const getPurposeText = () => {
    switch (purpose) {
      case "signin":
        return {
          title: "Verify Sign In",
          description: `We've sent a 6-digit OTP to`,
          showEmail: true,
        };
      case "password_change":
        return {
          title: "Verify Password Change",
          description: "Enter the OTP sent to your registered email to confirm.",
          showEmail: false,
        };
      case "email_change":
        return {
          title: "Verify New Email",
          description: "Enter the OTP sent to your new email address to confirm the change.",
          showEmail: false,
        };
      default:
        return {
          title: "Verify Your Email",
          description: "We've sent a 6-digit OTP to",
          showEmail: true,
        };
    }
  };

  const purposeText = getPurposeText();

  const getBackPath = () => {
    if (purpose === "password_change" || purpose === "email_change") return "/settings";
    if (purpose === "signin") return "/signin";
    return "/signup";
  };

  return (
    <div className="otp-verify-container">
      <h1 className="main-heading">{purposeText.title}</h1>
      <p className="sub-para">
        {purposeText.description}{" "}
        {purposeText.showEmail && <strong>{email}</strong>}
      </p>

      <div className="otp-input-wrapper">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setOtp(value);
          }}
          onKeyPress={handleKeyPress}
          maxLength={6}
          disabled={isLoading}
          className="otp-input"
          autoFocus
        />
      </div>

      <button
        onClick={verifyOTP}
        disabled={otp.length !== 6 || isLoading}
        className="verify-button"
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="resend-section">
        <p>Didn't receive the code?</p>
        <button
          onClick={resendOTP}
          disabled={resendCooldown > 0 || isLoading}
          className="resend-button"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
        </button>
      </div>

      <button
        onClick={() => router.push(getBackPath())}
        className="back-button"
        disabled={isLoading}
      >
        {purpose === "password_change" || purpose === "email_change"
          ? "Back to Settings"
          : purpose === "signin"
          ? "Back to Sign In"
          : "Back to Sign Up"}
      </button>
    </div>
  );
};

// wrap in Suspense because useSearchParams needs it in Next.js
export const Otp = () => (
  <Suspense fallback={<div className="otp-verify-container"><p>Loading...</p></div>}>
    <OtpInner />
  </Suspense>
);

export default Otp;