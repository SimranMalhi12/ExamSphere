import React from "react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = "",
}) => {
  return (
    <div
      style={{ borderRadius: "0px" }}
      className={`bg-white border border-zinc-200 p-6 shadow-sm flex flex-col justify-between hover:border-zinc-950 transition-colors ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-900 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold font-mono text-zinc-950 tracking-tight">
          {value ?? 0}
        </div>
        {(subtitle || trend) && (
          <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
            {trend && <span className="font-semibold text-emerald-600">{trend}</span>}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
