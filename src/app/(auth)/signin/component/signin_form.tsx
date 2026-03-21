"use client";
import "./signin_form.css";
import "../../auth-glass-inputs.css";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input/input";
import { Button } from "@/components/button/button";
import { useAlert } from "@/components/alert/alert";
import axios from "axios";

export const Signin_form = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useAlert();
  const router = useRouter();

  const isDisabled = !username || !password || isLoading;

  const buttonclick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await axios.post("/api/signin", {
        username: username.trim(),
        password,
      });

      if (res.data.success) {
        showSuccess("OTP sent to your email!", "Check your inbox");
        // redirect to OTP page with email prefilled
        router.push(`/otp?email=${encodeURIComponent(username.trim())}&purpose=signin`);
      } else {
        showError(res.data.message || "Sign in failed", "Error");
        setIsLoading(false);
      }

    } catch (error: any) {
      const message = error?.response?.data?.message || "Sign in failed. Please try again.";
      showError(message, "Sign In Failed");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isDisabled) {
      buttonclick();
    }
  };

  return (
    <div className="form-div auth-glass-inputs">
      <header className="signin-text">
        <h1 className="main-heading">Sign In</h1>
      </header>

      <Input
        label="Email or phone number"
        id="username"
        type="text"          
        placeholder="Email or phone number"
        value={username}
        onchange={(e) => setUsername(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onchange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />

      <div className="form-options">
        <a href="#forgotpassword" className="need-help">Forgot Password?</a>
      </div>

      <Button
        buttonname={isLoading ? "Signing In..." : "Sign In"}
        onclick={buttonclick}
        disabled={isDisabled}
      />
    </div>
  );
};