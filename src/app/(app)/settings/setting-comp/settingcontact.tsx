"use client";

import { Mail, Phone, Lock, Shield } from "lucide-react";

type ContactProps = {
  email: string | null;
  phone_number: string | number | null;
};

export const Settingcontact = ({ email, phone_number }: ContactProps) => {
  const handleEmailChange = () => {
    // User will implement OTP flow for email change here
    // Example: Open modal, send OTP, verify, call API
  };

  const handlePhoneChange = () => {
    // User will implement OTP flow for phone change here
    // Example: Open modal, send OTP, verify, call API
  };

  const handlePasswordChange = () => {

    // Example: Open modal, verify current password, set new password, call API
  };

  return (
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
          >
            Change
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
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

