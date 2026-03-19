"use client";
import { useState } from "react";
import { Input } from "@/components/input/input";
import { Button } from "@/components/button/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAlert } from "../../../../components/alert/alert";

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
    if (pass !== confirm) {
      showWarning("Passwords do not match", "Validation Error");
      return;
    }

    if (pass.length < 8) {  // fixed: 6 → 8 to match backend
      showWarning("Password must be at least 8 characters long", "Validation Error");
      return;
    }

    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordStrengthRegex.test(pass)) {
      showWarning("Password must contain uppercase, lowercase, and a number", "Validation Error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showWarning("Please enter a valid email address", "Validation Error");
      return;
    }

    if (phone_number.length !== 10 || !/^\d+$/.test(phone_number)) {
      showWarning("Phone number must be exactly 10 digits", "Validation Error");
      return;
    }

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
        password: pass,
      });

      if (res.data.success) {
        showSuccess(
          res.data.message || "Account created! Please check your email for OTP.",
          "Account Created"
        );

        // consistent with signin — pass via URL params, no sessionStorage
        setTimeout(() => {
          router.push(`/otp?email=${encodeURIComponent(email.toLowerCase().trim())}&purpose=signup`);
        }, 1500);
      } else {
        showError(res.data.message || "Signup failed", "Error");
        setIsLoading(false);
      }

    } catch (error: any) {
      console.error("Signup error:", error);
      const message = error?.response?.data?.message || "Something went wrong. Please try again.";
      showError(message, "Signup Failed");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !invalid && !isLoading) {
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
          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
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
        placeholder="Min 8 chars, uppercase, lowercase, number"
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