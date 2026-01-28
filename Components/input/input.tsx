"use client";

import { useState } from "react";
import "./input.css";

type InputProps = {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  value: string;
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  maxLength?: number;
};

export const Input = ({ 
  label, 
  id, 
  type, 
  placeholder, 
  value, 
  onchange,
  onKeyPress,
  disabled = false,
  maxLength
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="input-div">
      <label htmlFor={id}>{label}</label>

      <div className="input-wrapper">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onchange}
          onKeyPress={onKeyPress}
          disabled={disabled}
          maxLength={maxLength}
        />

        {isPassword && (
          <span
            className="password-toggle"
            onClick={() => !disabled && setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
            style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}
          >
            {showPassword ? (
              /* eye-off svg */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.05 0-9.3-3.14-11-8 1.01-2.83 3.06-5.17 5.71-6.46M9.9 4.24A10.94 10.94 0 0 1 12 4c5.05 0 9.3 3.14 11 8a10.97 10.97 0 0 1-1.67 2.68" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* eye svg */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </span>
        )}
      </div>
    </div>
  );
};