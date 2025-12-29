"use client";

import { useState } from "react";
import { Input } from "../../Components/input/input";
import { Button } from "../../Components/button/button";

export const Signup_form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const invalid = !name || !email || !pass || !confirm || pass !== confirm;

  return (
    <form className="form-div">
      <h1>Unlimited movies, TV shows, and more.</h1>
      <p className="sub">
        Create your account and start watching today.
      </p>

      <Input
        label="Full Name"
        id="name"
        type="text"
        placeholder="Full name"
        value={name}
        onchange={(e) => setName(e.target.value)}
      />

      <Input
        label="Email Address"
        id="email"
        type="email"
        placeholder="Email address"
        value={email}
        onchange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="Create a password"
        value={pass}
        onchange={(e) => setPass(e.target.value)}
      />

      <Input
        label="Confirm Password"
        id="confirm"
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onchange={(e) => setConfirm(e.target.value)}
      />

      <Button buttonname="Create Account" disabled={invalid} />
    </form>
  );
};
