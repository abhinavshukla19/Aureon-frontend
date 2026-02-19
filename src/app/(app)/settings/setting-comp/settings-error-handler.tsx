"use client";

import { useEffect } from "react";
import { useAlert } from "@/components/alert/alert";

interface SettingsErrorHandlerProps {
  error?: string | null;
}

export const SettingsErrorHandler: React.FC<SettingsErrorHandlerProps> = ({ error }) => {
  const { showError } = useAlert();

  useEffect(() => {
    if (error) {
      showError(error, "Settings Error");
    }
  }, [error, showError]);

  return null;
};

