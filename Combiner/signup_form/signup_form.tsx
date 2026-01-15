"use client";
import { useState } from "react";
import { Input } from "../../Components/input/input";
import { Button } from "../../Components/button/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAlert } from "../../Components/alert/alert";

export const Signup_form =() => {
  const router=useRouter();
  const { showSuccess, showError, showWarning } = useAlert();
  const [name, setName] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const invalid = !name || !email || !pass || !confirm || pass !== confirm;

  const signupbutton=async()=>{
    // Validation checks
    if (pass !== confirm) {
      showWarning("Passwords do not match", "Validation Error");
      return;
    }
    
    if (pass.length < 6) {
      showWarning("Password must be at least 6 characters long", "Validation Error");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showWarning("Please enter a valid email address", "Validation Error");
      return;
    }

    if (phone_number && phone_number.length !== 10) {
      showWarning("Phone number must be 10 digits", "Validation Error");
      return;
    }

    try {
    const res=await axios.post("/api/signup",{username:name , email , phone_number , password:pass })
    if(res.data.success===true){
        showSuccess(res.data.message || "Account created successfully!", "Account Created");
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      } else {
        showError(res.data.message || "Signup failed", "Error");
      }

    } catch (error: any) {
      console.log(error);
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
      } else if (error?.response?.status === 503) {
        errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
      } else if (error?.message?.includes('timeout')) {
        errorMessage = "The request took too long. Please check your connection and try again.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 409) {
        errorMessage = "An account with this email or phone number already exists. Please sign in instead.";
      } else if (error?.response?.status === 400) {
        errorMessage = "Invalid information provided. Please check all fields and try again.";
      }
      
      showError(errorMessage, "Signup Failed");
    }
    
  }
  

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
      />

      <Input
        label="Phone Number"
        id="phone_number"
        type="number"
        placeholder="Enter your 10 digit number"
        value={phone_number}
        onchange={(e) => setphone_number(e.target.value)}
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

      <Button onclick={signupbutton}  buttonname="Create Account" disabled={invalid} />
    </div>
  );
};
