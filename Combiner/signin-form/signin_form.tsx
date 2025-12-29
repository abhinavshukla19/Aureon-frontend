"use client";
import "./signin_form.css"

import { useState } from "react";
import { Input } from "../../Components/input/input";
import { Button } from "../../Components/button/button";

export const Signin_form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleButton = () => {
    // later
  };

  const isDisabled =!email || !password ;


  return (
    <form className="form-div">
      {/* HERO TEXT */}
      <header className="signin-text">
        <h1 className="signin-main-head">Sign In</h1>
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
      <Button buttonname="Sign In" onclick={handleButton} disabled={isDisabled} />
    </form>
  );
};

