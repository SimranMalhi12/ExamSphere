import React from "react";
import { FolderOpen } from "lucide-react";
import Button from "./Button";

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "Get started by adding your first record.",
  actionText,
  onAction,
  className = "",
}) => {
  return (
    <div
      style={{ borderRadius: "0px" }}
      className={`border border-dashed border-zinc-300 bg-white p-12 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 border border-zinc-200 bg-zinc-100 flex items-center justify-center text-zinc-600 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-zinc-900 uppercase tracking-tight">{title}</h4>
      <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
