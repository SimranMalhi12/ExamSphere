import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider text-xs";

  const variants = {
    primary: "bg-zinc-950 text-white hover:bg-zinc-800 border border-zinc-950 active:bg-black",
    secondary: "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400 active:bg-zinc-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700 border border-rose-600 active:bg-rose-800",
    outline: "bg-transparent text-zinc-900 border border-zinc-900 hover:bg-zinc-900 hover:text-white active:bg-black",
    ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 border border-transparent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[11px]",
    md: "px-4 py-2.5 text-xs",
    lg: "px-6 py-3.5 text-sm",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      style={{ borderRadius: "0px" }}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
