import React from "react";

export const Card = ({
  children,
  className = "",
  header,
  footer,
  title,
  subtitle,
  action,
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      style={{ borderRadius: "0px" }}
      className={`bg-white border border-zinc-200 shadow-sm transition-all duration-150 ${
        hover ? "hover:border-zinc-400 hover:shadow-md cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {(title || header || action) && (
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          {header ? (
            header
          ) : (
            <div>
              {title && <h3 className="text-base font-bold text-zinc-900 tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
            </div>
          )}
          {action && <div className="shrink-0 ml-4">{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-600">{footer}</div>}
    </div>
  );
};

export default Card;
