"use client";
import "./signin_form.css";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../Components/input/input";
import { Button } from "../../Components/button/button";
import axios from "axios";
import { useAlert } from "../../Components/alert/alert";

export const Signin_form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const router = useRouter();
  const { showSuccess, showError } = useAlert();

  const isDisabled = !email || !password;

  const buttonclick = async () => {
    try {
      const res = await axios.post(`/api/signin`, {
        username: email,
        password: password
      });
      
      console.log(res.data);
      
      // CHECK IF SUCCESS AND REDIRECT
      if (res.data.success) {
        showSuccess("Welcome back!", "Signed In");
        setTimeout(() => {
          router.push("/"); // REDIRECT TO HOME PAGE!
        }, 1000);
      } else {
        showError(res.data.message || "Invalid credentials", "Sign In Failed");
      }
      
    } catch (error: any) {
      console.error(error);
      showError(error?.response?.data?.message || "Login failed. Please try again.", "Sign In Failed");
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
      />

      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onchange={(e) => setPassword(e.target.value)}
      />

      {/* OPTIONS ROW */}
      <div className="form-options">
        <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </label>
        <a href="#" className="need-help">Need help?</a>
      </div>

      {/* CTA */}
      <Button buttonname="Sign In" onclick={buttonclick} disabled={isDisabled} />
    </div>
  );
};