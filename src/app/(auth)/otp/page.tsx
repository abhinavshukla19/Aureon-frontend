"use client";
import "./otp.css";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/components/alert/alert";
import { Input } from "@/components/input/input";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import axios from "axios";

// inner component that uses useSearchParams
const OtpInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError, showWarning } = useAlert();

  const emailFromUrl = searchParams.get("email")?.trim() || "";
  const purposeFromUrl = searchParams.get("purpose")?.trim() || "";

  const [otp, setOtp] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [paramsReady, setParamsReady] = useState(false);
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("signup");

  // Merge URL + sessionStorage (settings used to push /otp with no query string)
  useEffect(() => {
    const fromStorageEmail = sessionStorage.getItem("verification_email")?.trim() || "";
    const fromStoragePurpose = sessionStorage.getItem("otp_purpose")?.trim() || "";
    const e = emailFromUrl || fromStorageEmail;
    const p = purposeFromUrl || fromStoragePurpose || "signup";
    setEmail(e);
    setPurpose(p);
    setParamsReady(true);
  }, [emailFromUrl, purposeFromUrl]);

  // redirect if no email after we know params / storage
  useEffect(() => {
    if (!paramsReady) return;
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
  }, [paramsReady, email, purpose, router, showError]);

  // resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const passwordsValidForChange =
    purpose === "password_change" &&
    passwordNew.length >= 6 &&
    passwordNew === passwordConfirm;

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      showWarning("Please enter a valid 6-digit OTP", "Validation Error");
      return;
    }

    if (purpose === "password_change") {
      if (passwordNew.length < 6) {
        showWarning("New password must be at least 6 characters.", "Validation Error");
        return;
      }
      if (passwordNew !== passwordConfirm) {
        showWarning("Passwords do not match.", "Validation Error");
        return;
      }
    }

    setIsLoading(true);

    try {
      const body: Record<string, string> = { email, otp, purpose };
      if (purpose === "password_change") {
        body.newPassword = passwordNew;
      }

      const res = await axios.post("/api/otpverify", body);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || isLoading || otp.length !== 6) return;
    if (purpose === "password_change" && !passwordsValidForChange) return;
    verifyOTP();
  };

  const verifyDisabled =
    otp.length !== 6 ||
    isLoading ||
    (purpose === "password_change" && !passwordsValidForChange);

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
          title: "Reset your password",
          description:
            "Enter the code from your email, then choose a new password below.",
          showEmail: true,
        };
      case "email_change":
        return {
          title: "Verify new email",
          description: "Code sent to",
          showEmail: true,
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
  const isPasswordReset = purpose === "password_change" && paramsReady;

  const getBackPath = () => {
    if (purpose === "password_change" || purpose === "email_change") return "/settings";
    if (purpose === "signin") return "/signin";
    return "/signup";
  };

  return (
    <div
      className={`otp-verify-container${isPasswordReset ? " otp-verify-container--password-reset" : ""}`}
    >
      <div className="otp-ambient" aria-hidden />

      <div className="otp-card">
        <div className="otp-card-header">
          <span className="otp-eyebrow">
            {isPasswordReset
              ? "Account security"
              : purpose === "email_change"
                ? "Email update"
                : purpose === "signin"
                  ? "Sign in"
                  : "Verification"}
          </span>
          <h1 className="otp-title aureon-heading-gradient">{purposeText.title}</h1>
          <p className="otp-lead">
            {purposeText.description}{" "}
            {purposeText.showEmail ? (
              <span className="otp-email-chip">
                <Mail size={14} strokeWidth={2} aria-hidden />
                {email}
              </span>
            ) : null}
          </p>
        </div>

        <div className="otp-input-wrapper">
          <div className="otp-section-head">
            {isPasswordReset ? (
              <>
                <span className="otp-step-badge">1</span>
                <ShieldCheck size={18} strokeWidth={2} className="otp-section-icon" aria-hidden />
                <span className="otp-section-label">Code from email</span>
              </>
            ) : (
              <span className="otp-section-label">Enter 6-digit code</span>
            )}
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="• • • • • •"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
            }}
            onKeyDown={handleKeyPress}
            maxLength={6}
            disabled={isLoading}
            className="otp-input"
            autoComplete="one-time-code"
            autoFocus={!isPasswordReset}
            aria-label="One-time password code"
          />
          {otp.length > 0 && otp.length < 6 ? (
            <p className="otp-hint">{6 - otp.length} more digit{6 - otp.length === 1 ? "" : "s"}</p>
          ) : null}
        </div>

        {isPasswordReset ? (
          <div className="otp-password-panel">
            <div className="otp-section-head otp-section-head--password">
              <span className="otp-step-badge">2</span>
              <KeyRound size={18} strokeWidth={2} className="otp-section-icon" aria-hidden />
              <span className="otp-section-label">New password</span>
            </div>
            <p className="otp-password-hint">
              Choose a strong password you haven&apos;t used here before.
            </p>
            <div className="otp-password-fields">
              <Input
                label="New password"
                id="otp-new-password"
                type="password"
                placeholder="At least 6 characters"
                value={passwordNew}
                onchange={(e) => setPasswordNew(e.target.value)}
                disabled={isLoading}
              />
              <Input
                label="Confirm new password"
                id="otp-confirm-password"
                type="password"
                placeholder="Re-enter new password"
                value={passwordConfirm}
                onchange={(e) => setPasswordConfirm(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            {passwordNew.length > 0 &&
            passwordConfirm.length > 0 &&
            passwordNew !== passwordConfirm ? (
              <p className="otp-password-mismatch" role="alert">
                Passwords don&apos;t match yet.
              </p>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={verifyOTP}
          disabled={verifyDisabled}
          className={`verify-button${isPasswordReset ? " verify-button--accent" : ""}`}
        >
          {isLoading
            ? "Working…"
            : isPasswordReset
              ? "Update password"
              : "Verify"}
        </button>

        <div className="resend-section">
          <p>Didn&apos;t get the code?</p>
          <button
            type="button"
            onClick={resendOTP}
            disabled={resendCooldown > 0 || isLoading}
            className="resend-button"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.push(getBackPath())}
          className="back-button"
          disabled={isLoading}
        >
          {purpose === "password_change" || purpose === "email_change"
            ? "← Back to Settings"
            : purpose === "signin"
              ? "← Back to Sign In"
              : "← Back to Sign Up"}
        </button>
      </div>
    </div>
  );
};

// wrap in Suspense because useSearchParams needs it in Next.js
export const Otp = () => (
  <Suspense
    fallback={
      <div className="otp-verify-container">
        <div className="otp-ambient" aria-hidden />
        <div className="otp-card">
          <p className="otp-lead" style={{ textAlign: "center" }}>
            Loading…
          </p>
        </div>
      </div>
    }
  >
    <OtpInner />
  </Suspense>
);

export default Otp;