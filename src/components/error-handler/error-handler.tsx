"use client";

import { useEffect } from "react";
import { useAlert } from "../alert/alert";

interface ErrorHandlerProps {
  error?: string | null;
  title?: string;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, title = "Error" }) => {
  const { showError } = useAlert();

  useEffect(() => {
    if (error) {
      showError(error, title);
    }
  }, [error, title, showError]);

  return null;
};
