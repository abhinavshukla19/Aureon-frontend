"use client";
import "./otp.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "../../../../Components/alert/alert";
import axios from "axios";

export const Otp = () => {
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useAlert();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Get email from sessionStorage (set during signup)
    const storedEmail = sessionStorage.getItem("verification_email");
    if (!storedEmail) {
      showError("No email found. Please sign up again.", "Error");
      router.push("/signup");
      return;
    }
    setEmail(storedEmail);
  }, []);

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

    if (!/^\d+$/.test(otp)) {
      showWarning("OTP must contain only numbers", "Validation Error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/api/otpverify", { email, otp });

      if (res.data.success) {
        showSuccess("Email verified successfully!", "Success");
        sessionStorage.removeItem("verification_email");
        
        setTimeout(() => {
          router.push("/");      // redirect to home page
        }, 1000);
      } else {
        showError(res.data.message || "Verification failed", "Error");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 401) {
        errorMessage = "Invalid OTP. Please check and try again.";
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "OTP expired or invalid.";
      } else if (error?.response?.status === 429) {
        errorMessage = "Too many attempts. Please request a new OTP.";
      }
      
      showError(errorMessage, "Verification Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);

    try {
      // You'll need to create this endpoint to resend OTP
      const res = await axios.post("/api/resend-otp", { email });

      if (res.data.success) {
        showSuccess("OTP sent successfully! Check your email.", "Success");
        setResendCooldown(60); // 60 second cooldown
      } else {
        showError(res.data.message || "Failed to resend OTP", "Error");
      }
    } catch (error: any) {
      showError(
        error?.response?.data?.message || "Failed to resend OTP",
        "Error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6 && !isLoading) {
      verifyOTP();
    }
  };

  return (
    <div className="otp-verify-container">
      <h1 className="main-heading">Verify Your Email</h1>
      <p className="sub-para">
        We've sent a 6-digit OTP to <strong>{email}</strong>
      </p>

      <div className="otp-input-wrapper">
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setOtp(value);
          }}
          onKeyPress={handleKeyPress}
          maxLength={6}
          disabled={isLoading}
          className="otp-input"
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
          {resendCooldown > 0 
            ? `Resend in ${resendCooldown}s` 
            : "Resend OTP"}
        </button>
      </div>

      <button
        onClick={() => router.push("/signup")}
        className="back-button"
        disabled={isLoading}
      >
        Back to Signup
      </button>
    </div>
  );
};

export default Otp;