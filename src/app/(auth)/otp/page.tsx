"use client";
import "./otp.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/alert/alert";
import axios from "axios";

export const Otp = () => {
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useAlert();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState<string>("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Get email and purpose from sessionStorage
    const storedEmail = sessionStorage.getItem("verification_email");
    const storedPurpose = sessionStorage.getItem("otp_purpose") || "signup";
    
    if (!storedEmail) {
      showError("No email found. Please try again.", "Error");
      // Redirect based on purpose
      setTimeout(() => {
        if (storedPurpose === "password_change" || storedPurpose === "email_change") {
          router.push("/settings");
        } else {
          router.push("/signup");
        }
      }, 1500);
      return;
    }
    
    setEmail(storedEmail);
    setPurpose(storedPurpose);
  }, [router, showError]);

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
      const res = await axios.post("/api/otpverify", { 
        email, 
        otp,
        purpose 
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.data.success) {
        // Handle email change - call change-email API after OTP verification
        if (purpose === "email_change") {
          const currentEmail = sessionStorage.getItem("current_email");
          const newEmail = email; // The email we verified OTP for
          
          if (currentEmail && newEmail) {
            try {
              const changeEmailRes = await axios.post("/api/change-email", {
                newEmail: newEmail
              }, {
                timeout: 30000,
                headers: {
                  'Content-Type': 'application/json'
                }
              });

              if (changeEmailRes.data.success) {
                showSuccess("Email changed successfully!", "Success");
              } else {
                showError(changeEmailRes.data.message || "Failed to update email", "Error");
                setIsLoading(false);
                return;
              }
            } catch (error: any) {
              console.error("Email change error:", error);
              showError("Failed to update email. Please try again.", "Error");
              setIsLoading(false);
              return;
            }
          }
        }
        
        // Show success message based on purpose
        const successMessages: Record<string, string> = {
          signup: "Email verified successfully! Welcome to Aureon!",
          password_change: "OTP verified! You can now set your new password.",
          email_change: "Email changed successfully!"
        };
        
        showSuccess(
          successMessages[purpose] || "OTP verified successfully!", 
          "Success"
        );
        
        // Clean up sessionStorage
        sessionStorage.removeItem("verification_email");
        sessionStorage.removeItem("otp_purpose");
        sessionStorage.removeItem("current_email");
        
        // Redirect based on purpose
        setTimeout(() => {
          if (purpose === "password_change") {
            // Set flag for password form and redirect to settings
            sessionStorage.setItem("otp_verified_password", "true");
            router.push("/settings");
          } else if (purpose === "email_change") {
            // Email already changed, just go to settings
            router.push("/settings");
          } else {
            // Signup - redirect to home
            router.push("/");
          }
        }, 1500);
      } else {
        showError(res.data.message || "Verification failed", "Error");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 401) {
        errorMessage = "Invalid OTP. Please check and try again.";
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "OTP expired or invalid.";
      } else if (error?.response?.status === 429) {
        errorMessage = "Too many attempts. Please request a new OTP.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
      } else if (error?.response?.status === 503) {
        errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
      } else if (error?.message?.includes('timeout')) {
        errorMessage = "The request took too long. Please check your connection and try again.";
      }
      
      showError(errorMessage, "Verification Failed");
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);

    try {
      const res = await axios.post("/api/resend-otp", { 
        email,
        purpose 
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.data.success) {
        showSuccess("OTP sent successfully! Check your email.", "Success");
        setResendCooldown(60); // 60 second cooldown
      } else {
        showError(res.data.message || "Failed to resend OTP", "Error");
      }
    } catch (error: any) {
      let errorMessage = "Failed to resend OTP";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      }
      
      showError(errorMessage, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6 && !isLoading) {
      verifyOTP();
    }
  };

  // Get title and description based on purpose
  const getPurposeText = () => {
    switch (purpose) {
      case "password_change":
        return {
          title: "Verify OTP for Password Change",
          description: "We've sent a 6-digit OTP to verify your identity before changing your password.",
          showEmail: false
        };
      case "email_change":
        return {
          title: "Verify OTP for Email Change",
          description: "We've sent a 6-digit OTP to your new email address to verify the change.",
          showEmail: false
        };
      default:
        return {
          title: "Verify Your Email",
          description: "We've sent a 6-digit OTP to",
          showEmail: true
        };
    }
  };

  const purposeText = getPurposeText();

  return (
    <div className="otp-verify-container">
      <h1 className="main-heading">{purposeText.title}</h1>
      <p className="sub-para">
        {purposeText.description} {purposeText.showEmail && <strong>{email}</strong>}
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
        onClick={() => {
          if (purpose === "password_change" || purpose === "email_change") {
            router.push("/settings");
          } else {
            router.push("/signup");
          }
        }}
        className="back-button"
        disabled={isLoading}
      >
        {purpose === "password_change" || purpose === "email_change" 
          ? "Back to Settings" 
          : "Back to Signup"}
      </button>
    </div>
  );
};

export default Otp;