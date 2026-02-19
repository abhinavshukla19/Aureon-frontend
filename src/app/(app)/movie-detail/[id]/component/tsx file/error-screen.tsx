"use client";

import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import "../style/error-screen.css";

type ErrorScreenProps = {
  message: string;
  type?: '404' | '500' | 'auth' | 'network';
  showSignIn?: boolean;
};

export function ErrorScreen({ message, type = '500', showSignIn = false }: ErrorScreenProps) {
  const router = useRouter();

  const errorConfig = {
    '404': {
      title: 'Content Not Found',
      icon: '🎬',
      description: 'The movie you\'re looking for doesn\'t exist or has been removed.'
    },
    '500': {
      title: 'Something Went Wrong',
      icon: '⚠️',
      description: 'We\'re experiencing technical difficulties. Please try again.'
    },
    'auth': {
      title: 'Authentication Required',
      icon: '🔒',
      description: 'Please sign in to continue watching.'
    },
    'network': {
      title: 'Connection Error',
      icon: '📡',
      description: 'Unable to connect to the server. Check your internet connection.'
    }
  };

  const config = errorConfig[type];

  return (
    <div className="error-screen">
      <div className="error-content">
        <div className="error-icon">{config.icon}</div>
        <h1 className="error-title">{config.title}</h1>
        <p className="error-message">{message || config.description}</p>
        
        <div className="error-actions">
          {showSignIn ? (
            <button 
              className="error-btn primary"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </button>
          ) : (
            <>
              <button 
                className="error-btn primary"
                onClick={() => router.refresh()}
              >
                <RefreshCcw size={18} />
                Try Again
              </button>
              <button 
                className="error-btn secondary"
                onClick={() => router.push('/')}
              >
                <Home size={18} />
                Go Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}