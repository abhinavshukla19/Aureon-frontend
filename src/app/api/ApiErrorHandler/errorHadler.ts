export const handleAxiosError = (error: any) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (error?.code === "ECONNREFUSED" || error?.code === "ENOTFOUND") {
    return { message: "Unable to connect to server. Please try again.", status: 503 };
  }
  if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
    return { message: "Request timed out. Please try again.", status: 504 };
  }
  if (status === 401) return { message: "Session expired. Please sign in again.", status: 401 };
  if (status === 403) return { message: "Access denied.", status: 403 };
  if (status === 404) return { message: "Not found.", status: 404 };
  if (status === 409) return { message: message || "Conflict error.", status: 409 };
  if (status === 429) return { message: "Too many attempts. Please wait.", status: 429 };
  if (status === 502) return { message: "Server not responding. Please try again.", status: 502 };
  if (status === 503) return { message: "Service temporarily unavailable.", status: 503 };
  if (status === 504) return { message: "Server took too long. Please try again.", status: 504 };
  if (message) return { message, status: status || 400 };

  return { message: "Something went wrong. Please try again.", status: 500 };
};