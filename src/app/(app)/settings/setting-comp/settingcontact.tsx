"use client";

import { Mail, Phone, Lock, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "@/components/alert/alert";
import { Input } from "@/components/input/input";
import { Button } from "@/components/button/button";

type ContactProps = {
  email: string | null;
  phone_number: string | number | null;
};

export const Settingcontact = ({ email, phone_number }: ContactProps) => {
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useAlert();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleEmailChange = () => {
    // Show modal to get new email
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async () => {
    if (!newEmail || !email) {
      showError("Please enter a valid email address.", "Validation Error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showError("Please enter a valid email address.", "Validation Error");
      return;
    }

    if (newEmail.toLowerCase() === email.toLowerCase()) {
      showError("New email must be different from current email.", "Validation Error");
      return;
    }

    setIsLoading("email");

    try {
      // Request OTP for email change (send to new email)
      const res = await axios.post("/api/resend-otp", {
        email: newEmail.toLowerCase().trim(),
        purpose: "email_change",
        currentEmail: email // Send current email for backend verification
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.data.success) {
        // Store new email and purpose in sessionStorage
        sessionStorage.setItem("verification_email", newEmail.toLowerCase().trim());
        sessionStorage.setItem("otp_purpose", "email_change");
        sessionStorage.setItem("current_email", email); // Store current email for backend
        
        showSuccess("OTP sent to your new email. Please check your inbox.", "OTP Sent");
        setShowEmailModal(false);
        setNewEmail("");
        
        // Redirect to OTP page
        setTimeout(() => {
          router.push("/otp");
        }, 1000);
      } else {
        showError(res.data.message || "Failed to send OTP", "Error");
      }
    } catch (error: any) {
      console.error("Email change OTP error:", error);
      
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      } else if (error?.message?.includes('timeout')) {
        errorMessage = "The request took too long. Please try again.";
      }
      
      showError(errorMessage, "Error");
    } finally {
      setIsLoading(null);
    }
  };

  const handlePhoneChange = () => {
    // Phone change can be implemented similarly if needed
    showWarning("Phone number change feature coming soon!", "Coming Soon");
  };

  const handlePasswordChange = async () => {
    if (!email) {
      showError("Email not found. Please contact support.", "Error");
      return;
    }

    setIsLoading("password");

    try {
      // Request OTP for password change
      const res = await axios.post("/api/resend-otp", {
        email: email,
        purpose: "password_change"
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.data.success) {
        // Store email and purpose in sessionStorage
        sessionStorage.setItem("verification_email", email);
        sessionStorage.setItem("otp_purpose", "password_change");
        
        showSuccess("OTP sent to your email. Please check your inbox.", "OTP Sent");
        
        // Redirect to OTP page
        setTimeout(() => {
          router.push("/otp");
        }, 1000);
      } else {
        showError(res.data.message || "Failed to send OTP", "Error");
      }
    } catch (error: any) {
      console.error("Password change OTP error:", error);
      
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      } else if (error?.message?.includes('timeout')) {
        errorMessage = "The request took too long. Please try again.";
      }
      
      showError(errorMessage, "Error");
    } finally {
      setIsLoading(null);
    }
  };

  // Check if we should show password form (after OTP verification)
  useEffect(() => {
    const otpVerified = sessionStorage.getItem("otp_verified_password");
    if (otpVerified === "true") {
      setShowPasswordForm(true);
      sessionStorage.removeItem("otp_verified_password");
    }
  }, []);

  const handlePasswordSubmit = async (newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      showError("Passwords do not match.", "Validation Error");
      return;
    }

    if (newPassword.length < 6) {
      showError("Password must be at least 6 characters long.", "Validation Error");
      return;
    }

    setIsLoading("password");

    try {
      const res = await axios.post("/api/change-password", {
        newPassword: newPassword
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.data.success) {
        showSuccess("Password changed successfully!", "Success");
        setShowPasswordForm(false);
      } else {
        showError(res.data.message || "Failed to change password", "Error");
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      
      let errorMessage = "Failed to change password. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      } else if (error?.message?.includes('timeout')) {
        errorMessage = "The request took too long. Please try again.";
      }
      
      showError(errorMessage, "Error");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => !isLoading && setShowEmailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => !isLoading && setShowEmailModal(false)}
              disabled={isLoading === "email"}
            >
              <X size={20} />
            </button>
            
            <div className="modal-content">
              <h2 className="modal-title">Change Email Address</h2>
              <p className="modal-description">
                Enter your new email address. We'll send an OTP to verify it.
              </p>
              
              <Input
                label="New Email Address"
                id="new-email"
                type="email"
                placeholder="Enter new email address"
                value={newEmail}
                onchange={(e) => setNewEmail(e.target.value)}
                disabled={isLoading === "email"}
              />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <Button
                  buttonname={isLoading === "email" ? "Sending OTP..." : "Send OTP"}
                  onclick={handleEmailSubmit}
                  disabled={!newEmail || isLoading === "email"}
                />
                <Button
                  buttonname="Cancel"
                  onclick={() => {
                    setShowEmailModal(false);
                    setNewEmail("");
                  }}
                  disabled={isLoading === "email"}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Form */}
      {showPasswordForm && (
        <div className="setting-password-form-wrapper">
          <div className="setting-password-form">
            <div className="form-header">
              <h3>Set New Password</h3>
              <button 
                onClick={() => setShowPasswordForm(false)}
                className="close-form-btn"
                disabled={isLoading === "password"}
              >
                <X size={20} />
              </button>
            </div>
            <PasswordChangeForm 
              onSubmit={handlePasswordSubmit}
              isLoading={isLoading === "password"}
            />
          </div>
        </div>
      )}

      <div className="setting-contact-wrapper slide-up">
        <div className="setting-contact-header">
          <div className="contact-icon-wrapper">
            <Shield size={18} strokeWidth={2} />
          </div>
          <h2 className="setting-contact-head">Account & Security</h2>
        </div>

        <div className="setting-contact-main-div">
        {/* Email Section */}
        <div className="setting-contact-item-card">
          <div className="contact-item-top">
            <div className="contact-label-group">
              <Mail size={18} strokeWidth={2} />
              <p className="contact-head">Email Address</p>
            </div>
            <p className="contact-value">{email || "Not set"}</p>
          </div>
          <button
            className="contact-edit-btn"
            onClick={handleEmailChange}
            disabled={isLoading === "email" || !email}
          >
            {isLoading === "email" ? "Sending..." : "Change"}
          </button>
        </div>

        {/* Phone Number Section */}
        <div className="setting-contact-item-card">
          <div className="contact-item-top">
            <div className="contact-label-group">
              <Phone size={18} strokeWidth={2} />
              <p className="contact-head">Phone Number</p>
            </div>
            <p className="contact-value">{phone_number || "Not set"}</p>
          </div>
          <button
            className="contact-edit-btn"
            onClick={handlePhoneChange}
            disabled={isLoading !== null}
          >
            Change
          </button>
        </div>

        {/* Password Section */}
        <div className="setting-contact-item-card">
          <div className="contact-item-top">
            <div className="contact-label-group">
              <Lock size={18} strokeWidth={2} />
              <p className="contact-head">Password</p>
            </div>
            <p className="contact-value">••••••••••</p>
          </div>
          <button
            className="contact-edit-btn"
            onClick={handlePasswordChange}
            disabled={isLoading === "password" || !email}
          >
            {isLoading === "password" ? "Sending..." : "Change"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

// Password Change Form Component
const PasswordChangeForm = ({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (newPassword: string, confirmPassword: string) => void;
  isLoading: boolean;
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    onSubmit(newPassword, confirmPassword);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newPassword && confirmPassword && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="password-form-content">
      <Input
        label="New Password"
        id="new-password"
        type="password"
        placeholder="Enter new password (min 6 characters)"
        value={newPassword}
        onchange={(e) => setNewPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />

      <Input
        label="Confirm Password"
        id="confirm-password"
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onchange={(e) => setConfirmPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />

      <Button
        buttonname={isLoading ? "Changing Password..." : "Change Password"}
        onclick={handleSubmit}
        disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || isLoading}
      />
    </div>
  );
};

