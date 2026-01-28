"use client";
import { useState } from "react";
import { Input } from "../../Components/input/input";
import { Button } from "../../Components/button/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAlert } from "../../Components/alert/alert";

export const Signup_form = () => {
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useAlert();
  const [name, setName] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const invalid = !name || !email || !phone_number || !pass || !confirm || pass !== confirm;

  const signupbutton = async () => {
    // Validation checks
    if (pass !== confirm) {
      showWarning("Passwords do not match", "Validation Error");
      return;
    }

    if (pass.length < 6) {
      showWarning("Password must be at least 6 characters long", "Validation Error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showWarning("Please enter a valid email address", "Validation Error");
      return;
    }

    // Phone validation
    if (!phone_number || phone_number.length !== 10 || !/^\d+$/.test(phone_number)) {
      showWarning("Phone number must be exactly 10 digits", "Validation Error");
      return;
    }

    // Name validation
    if (name.trim().length < 2) {
      showWarning("Name must be at least 2 characters long", "Validation Error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/api/signup", {
        username: name.trim(),
        email: email.toLowerCase().trim(),
        phone_number,
        password: pass
      });

      if (res.data.success === true) {
        showSuccess(
          res.data.message || "Account created successfully! Please check your email for OTP.",
          "Account Created"
        );
        
        // Store email in sessionStorage for OTP verification page
        sessionStorage.setItem("verification_email", email.toLowerCase().trim());
        
        setTimeout(() => {
          router.push("/otp");
        }, 1500);
      } else {
        showError(res.data.message || "Signup failed", "Error");
      }

    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error?.response?.status === 409) {
        errorMessage = "An account with this email or phone number already exists. Please sign in instead.";
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "Invalid information provided. Please check all fields and try again.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
      } else if (error?.response?.status === 503) {
        errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
      } else if (error?.message?.includes('timeout')) {
        errorMessage = "The request took too long. Please check your connection and try again.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showError(errorMessage, "Signup Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !invalid && !isLoading) {
      signupbutton();
    }
  };

  return (
    <div className="form-div">
      <h1 className="main-heading">Start your streaming journey</h1>
      <p className="sub-para">
        Create your account in seconds and dive into a world of premium content.
      </p>

      <Input
        label="Full Name"
        id="name"
        type="text"
        placeholder="Full name"
        value={name}
        onchange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />

      <Input
        label="Phone Number"
        id="phone_number"
        type="tel"
        placeholder="Enter your 10 digit number"
        value={phone_number}
        onchange={(e) => {
          // Only allow numbers and limit to 10 digits
          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
          setphone_number(value);
        }}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        maxLength={10}
      />

      <Input
        label="Email Address"
        id="email"
        type="email"
        placeholder="Email address"
        value={email}
        onchange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="Create a password (min 6 characters)"
        value={pass}
        onchange={(e) => setPass(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />

      <Input
        label="Confirm Password"
        id="confirm"
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onchange={(e) => setConfirm(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />

      <Button
        onclick={signupbutton}
        buttonname={isLoading ? "Creating Account..." : "Create Account"}
        disabled={invalid || isLoading}
      />
    </div>
  );
};