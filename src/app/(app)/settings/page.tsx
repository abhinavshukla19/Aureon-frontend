"use client";
import { Button } from "../../../../Components/button/button";
import { Settings as SettingsIcon, Crown, Shield, Lock } from "lucide-react";
import "./settings.css";

const Settings = () => {


  const handleSubscriptionbutton = () => {
    window.location.href = "/subscription";
  };

  return (
    <div className="setting-main-div">
      {/* HEADER */}
      <div className="setting-header-div fade-in">
        <div className="setting-title-row">
          <div className="settings-icon-wrapper">
            <SettingsIcon size={24} strokeWidth={2} />
          </div>
          <h1 className="settings-main-head-para">Settings</h1>
        </div>
        <p className="setting-head-para">
          Manage your subscription, security and playback preferences
        </p>
      </div>

      {/* SUBSCRIPTION CARD */}
      <div className="setting-subscription-main-div slide-up">
        <div className="setting-subscription-content">
          <div className="setting-subscription-header">
            <div className="subscription-icon-wrapper">
              <Crown size={18} strokeWidth={2} />
            </div>
            <h2 className="settng-subscription-head">Subscription</h2>
          </div>

          <div className="setting-plans-div">
            <div className="plan-badge">
              <span className="setting-plan-para">Standard HDR</span>
            </div>
            <div className="billing-info">
              <span className="billing-label">Next billing date</span>
              <span className="setting-plan-bill">23 Jan 2026</span>
            </div>
          </div>
        </div>

        <div className="button-to-subscription-div">
          <Button onclick={handleSubscriptionbutton} buttonname="Go to Subscription Page"/>
        </div>
      </div>

      {/* Security */}
      <div className="setting-security-div slide-up">
        <div className="setting-security-header">
          <div className="security-icon-wrapper">
            <Shield size={18} strokeWidth={2} />
          </div>
          <h2 className="setting-security-head">Security</h2>
        </div>
        
        <div className="setting-password-main-div">
          <div className="setting-password-div">
            <div className="password-label-group">
              <Lock size={16} strokeWidth={2} />
              <p className="pass-head">Password</p>
            </div>
            <p className="pass-symbol">••••••••••</p>
          </div>
          
          <div className="setting-changepassword-div">
            <Button buttonname="Change Password"/>
          </div>
          
          <div className="more-detail-para-div">
            <p className="detail-para">
              For more details about you. Check <a href="/profile">Profile page</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
