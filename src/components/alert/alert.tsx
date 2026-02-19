"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import "./alert.css";

export type AlertType = "success" | "error" | "warning" | "info";

export interface Alert {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (type: AlertType, message: string, options?: { title?: string; autoClose?: boolean; autoCloseDelay?: number }) => string;
  removeAlert: (id: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
  maxAlerts?: number;
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
}

export const AlertProvider: React.FC<AlertProviderProps> = ({
  children,
  maxAlerts = 5,
  position = "top-right",
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const addAlert = useCallback(
    (
      type: AlertType,
      message: string,
      options?: { title?: string; autoClose?: boolean; autoCloseDelay?: number }
    ): string => {
      const id = `alert-${Date.now()}-${Math.random()}`;
      const newAlert: Alert = {
        id,
        type,
        message,
        title: options?.title,
        autoClose: options?.autoClose ?? true,
        autoCloseDelay: options?.autoCloseDelay ?? 5000,
      };

      setAlerts((prev) => {
        const updated = [newAlert, ...prev];
        return updated.slice(0, maxAlerts);
      });

      return id;
    },
    [maxAlerts]
  );

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      addAlert("success", message, { title });
    },
    [addAlert]
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      addAlert("error", message, { title });
    },
    [addAlert]
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      addAlert("warning", message, { title });
    },
    [addAlert]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      addAlert("info", message, { title });
    },
    [addAlert]
  );

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <AlertContainer alerts={alerts} position={position} onRemove={removeAlert} />
    </AlertContext.Provider>
  );
};

interface AlertContainerProps {
  alerts: Alert[];
  position: string;
  onRemove: (id: string) => void;
}

const AlertContainer: React.FC<AlertContainerProps> = ({ alerts, position, onRemove }) => {
  if (alerts.length === 0) return null;

  const positionClass = `alert-container-${position}`;

  return (
    <div className={`alert-container ${positionClass}`}>
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface AlertItemProps {
  alert: Alert;
  onRemove: (id: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onRemove }) => {
  useEffect(() => {
    if (alert.autoClose) {
      const timer = setTimeout(() => {
        onRemove(alert.id);
      }, alert.autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [alert.autoClose, alert.autoCloseDelay, alert.id, onRemove]);

  const getIcon = () => {
    const iconProps = { size: 22, strokeWidth: 2.5 };
    switch (alert.type) {
      case "success":
        return <CheckCircle2 {...iconProps} />;
      case "error":
        return <XCircle {...iconProps} />;
      case "warning":
        return <AlertTriangle {...iconProps} />;
      case "info":
        return <Info {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  return (
    <div className={`alert alert-${alert.type}`} role="alert">
      <div className="alert-icon-wrapper">{getIcon()}</div>
      <div className="alert-text">
        {alert.title && <h4 className="alert-title">{alert.title}</h4>}
        <p className="alert-message">{alert.message}</p>
      </div>
      <button
        className="alert-close"
        onClick={() => onRemove(alert.id)}
        aria-label="Close alert"
        type="button"
      >
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
};

