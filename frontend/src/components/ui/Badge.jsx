import React from "react";

const Badge = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const lower = typeof children === "string" ? children.toLowerCase() : "";
  let appliedVariant = variant;
  if (variant === "default") {
    if (lower === "published" || lower === "passed" || lower === "completed") appliedVariant = "success";
    else if (lower === "draft") appliedVariant = "draft";
    else if (lower === "closed" || lower === "failed") appliedVariant = "danger";
    else if (lower === "easy") appliedVariant = "easy";
    else if (lower === "medium") appliedVariant = "medium";
    else if (lower === "hard") appliedVariant = "hard";
  }

  const variants = {
    default: "bg-zinc-100 text-zinc-800 border-zinc-300",
    outline: "bg-transparent text-zinc-800 border-zinc-400",
    success: "bg-emerald-50 text-emerald-700 border-emerald-300",
    danger: "bg-rose-50 text-rose-700 border-rose-300",
    warning: "bg-amber-50 text-amber-800 border-amber-300",
    draft: "bg-zinc-100 text-zinc-700 border-zinc-300",
    published: "bg-emerald-50 text-emerald-800 border-emerald-300",
    closed: "bg-zinc-200 text-zinc-600 border-zinc-400",
    easy: "bg-emerald-50 text-emerald-800 border-emerald-300",
    medium: "bg-amber-50 text-amber-800 border-amber-300",
    hard: "bg-rose-50 text-rose-800 border-rose-300",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-xs",
  };

  return (
    <span
      style={{ borderRadius: "0px" }}
      className={`inline-flex items-center font-mono font-semibold uppercase tracking-wider border ${
        variants[appliedVariant] || variants.default
      } ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
