"use client";
import "./signin_form.css";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input/input";
import { Button } from "@/components/button/button";
import { useAlert } from "@/components/alert/alert";
import axios from "axios";


export const Signin_form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useAlert();
  const router = useRouter();
  
  const isDisabled = !email || !password || isLoading;

  //  API call on button click
  const buttonclick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const res = await axios.post(`/api/signin`, {
        username: email.trim(),
        password: password
      }, {
        timeout: 30000, // 30 seconds timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // CHECK IF SUCCESS AND REDIRECT
      if (res.data.success) {
        showSuccess("Welcome back!", "Signed In");
        setTimeout(() => {
          router.push("/"); // REDIRECT TO home PAGE
        }, 1000);
      } else {
        showError(res.data.message || "Invalid credentials", "Sign In Failed");
        setIsLoading(false);
      }
      
    } catch (error: any) {
      console.error("Signin error:", error);
      let errorMessage = "Login failed. Please try again.";
      
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error?.response?.status === 502) {
        errorMessage = "Backend server is not responding. The server may be down or overloaded. Please try again in a few moments.";
      } else if (error?.response?.status === 504) {
        errorMessage = "Request timeout. The server took too long to respond. Please try again.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
      } else if (error?.response?.status === 503) {
        errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
      } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
        errorMessage = "The request took too long (over 30 seconds). Please check your connection and try again.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 401) {
        errorMessage = "Invalid email/phone number or password. Please check your credentials and try again.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Account not found. Please check your email/phone number or sign up for a new account.";
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "Invalid information provided. Please check all fields and try again.";
      }
      
      showError(errorMessage, "Sign In Failed");
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isDisabled) {
      buttonclick();
    }
  };

  return (
    <div className="form-div">
      {/* HERO TEXT */}
      <header className="signin-text">
        <h1 className="main-heading">Sign In</h1>
      </header>

      {/* INPUTS */}
      <Input
        label="Email or phone number"
        id="email"
        type="email"
        placeholder="Email or phone number"
        value={email}
        onchange={(e) => setEmail(e.target.value)}
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

      {/* OPTIONS ROW */}
      <div className="form-options">
        <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <span>Remember me</span>
        </label>
        <a href="#forgotpassword" className="need-help">Forgot Password ?</a>
      </div>

      {/* CTA */}
      <Button 
        buttonname={isLoading ? "Signing In..." : "Sign In"} 
        onclick={buttonclick} 
        disabled={isDisabled} 
      />
    </div>
  );
};