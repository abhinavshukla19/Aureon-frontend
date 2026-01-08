"use client";

import { useEffect } from "react";
import { useAlert } from "../../Components/alert/alert";

interface ProfileErrorHandlerProps {
  error?: string | null;
}

export const ProfileErrorHandler: React.FC<ProfileErrorHandlerProps> = ({ error }) => {
  const { showError } = useAlert();

  useEffect(() => {
    if (error) {
      showError(error, "Profile Error");
    }
  }, [error, showError]);

  return null;
};

