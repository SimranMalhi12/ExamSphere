import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

export const Table = ({
  headers = [],
  children,
  className = "",
}) => {
  return (
    <div className="w-full overflow-x-auto border border-zinc-200 bg-white" style={{ borderRadius: "0px" }}>
      <table className={`w-full text-left text-xs ${className}`}>
        <thead className="bg-zinc-100 text-zinc-700 uppercase font-mono tracking-wider border-b border-zinc-200">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className={`py-3.5 px-4 font-bold ${
                  typeof header === "object" ? header.className : ""
                }`}
              >
                {typeof header === "object" ? header.label : header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 font-normal text-zinc-800">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between py-4 border-t border-zinc-200 mt-4 text-xs">
      <div className="text-zinc-500 font-mono">
        Showing page <span className="font-bold text-zinc-900">{currentPage}</span> of{" "}
        <span className="font-bold text-zinc-900">{totalPages}</span>
        {totalItems !== undefined && ` (${totalItems} total)`}
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};
