import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";

const ErrorState = ({
  title = "Failed to load data",
  message = "An error occurred while communicating with the server. Please check your connection and try again.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      style={{ borderRadius: "0px" }}
      className={`border border-rose-200 bg-rose-50/50 p-10 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 border border-rose-300 bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-rose-950 uppercase tracking-tight">{title}</h4>
      <p className="text-xs text-rose-700 max-w-sm mt-1 mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
