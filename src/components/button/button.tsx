"use client";

import "./button.css";

type ButtonProps = {
  buttonname: string;
  onclick?: () => void;
  disabled?: boolean;
};

export const Button = ({ buttonname, onclick, disabled }: ButtonProps) => {
  return (
    <button onClick={onclick} disabled={disabled}>
      {buttonname}
    </button>
  );
};
