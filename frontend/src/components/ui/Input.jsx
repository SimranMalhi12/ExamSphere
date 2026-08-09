import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Input = ({
  label,
  id,
  type = "text",
  error,
  helperText,
  required = false,
  className = "",
  icon: Icon,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
        >
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={actualType}
          style={{ borderRadius: "0px" }}
          className={`w-full bg-white border ${
            error ? "border-rose-500 ring-1 ring-rose-500" : "border-zinc-300 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
          } text-zinc-900 text-sm px-3.5 py-2.5 outline-none transition-colors placeholder:text-zinc-400 ${
            Icon ? "pl-9" : ""
          } ${isPassword ? "pr-10" : ""} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};

export const Select = ({
  label,
  id,
  options = [],
  error,
  helperText,
  required = false,
  className = "",
  placeholder = "Select an option",
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
        >
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <select
        id={id}
        style={{ borderRadius: "0px" }}
        className={`w-full bg-white border ${
          error ? "border-rose-500 ring-1 ring-rose-500" : "border-zinc-300 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
        } text-zinc-900 text-sm px-3.5 py-2.5 outline-none transition-colors cursor-pointer ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};

export const Textarea = ({
  label,
  id,
  error,
  helperText,
  required = false,
  rows = 3,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
        >
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        style={{ borderRadius: "0px" }}
        className={`w-full bg-white border ${
          error ? "border-rose-500 ring-1 ring-rose-500" : "border-zinc-300 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
        } text-zinc-900 text-sm px-3.5 py-2.5 outline-none transition-colors placeholder:text-zinc-400 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};
