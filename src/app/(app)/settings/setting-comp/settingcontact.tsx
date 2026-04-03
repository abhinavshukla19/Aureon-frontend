"use client";

import { Mail, Phone, Lock, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
      const res = await axios.post("/api/request-email-change", {
        newEmail: newEmail.toLowerCase().trim(),
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.data.success) {
        sessionStorage.setItem("verification_email", email);
        sessionStorage.setItem("otp_purpose", "email_change");
        
        showSuccess("OTP sent to your new email. Please check your inbox.", "OTP Sent");
        setShowEmailModal(false);
        setNewEmail("");

        // OTP page reads email + purpose from URL (same as signin/signup)
        setTimeout(() => {
          router.push(
            `/otp?email=${encodeURIComponent(email)}&purpose=email_change`
          );
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
      const res = await axios.post("/api/request-password-change", {}, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.data.success) {
        const otpEmail = (res.data.email || email).trim();
        sessionStorage.setItem("verification_email", otpEmail);
        sessionStorage.setItem("otp_purpose", "password_change");
        
        showSuccess("OTP sent to your email. Please check your inbox.", "OTP Sent");

        setTimeout(() => {
          router.push(
            `/otp?email=${encodeURIComponent(otpEmail)}&purpose=password_change`
          );
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
          <div className="contact-item-row">
            <div className="contact-item-info">
              <div className="contact-label-group">
                <Mail size={18} strokeWidth={2} />
                <p className="contact-head">Email Address</p>
              </div>
              <p className="contact-value">{email || "Not set"}</p>
            </div>
            <button
              type="button"
              className="contact-edit-btn contact-edit-btn--inline"
              onClick={handleEmailChange}
              disabled={isLoading === "email" || !email}
            >
              {isLoading === "email" ? "Sending…" : "Change"}
            </button>
          </div>
        </div>

        {/* Phone Number Section */}
        <div className="setting-contact-item-card">
          <div className="contact-item-row">
            <div className="contact-item-info">
              <div className="contact-label-group">
                <Phone size={18} strokeWidth={2} />
                <p className="contact-head">Phone Number</p>
              </div>
              <p className="contact-value">{phone_number || "Not set"}</p>
            </div>
            <button
              type="button"
              className="contact-edit-btn contact-edit-btn--inline"
              onClick={handlePhoneChange}
              disabled={isLoading !== null}
            >
              Change
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="setting-contact-item-card">
          <div className="contact-item-row">
            <div className="contact-item-info">
              <div className="contact-label-group">
                <Lock size={18} strokeWidth={2} />
                <p className="contact-head">Password</p>
              </div>
              <p className="contact-value">••••••••••</p>
            </div>
            <button
              type="button"
              className="contact-edit-btn contact-edit-btn--inline"
              onClick={handlePasswordChange}
              disabled={isLoading === "password" || !email}
            >
              {isLoading === "password" ? "Sending…" : "Change"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
