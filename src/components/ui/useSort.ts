"use client";

import { useState } from "react";

export function useSort() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);

  function toggleSort(col: string) {
    if (sortColumn === col) {
      setSortDir((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc",
      );
    } else {
      setSortColumn(col);
      setSortDir("asc");
    }
  }

  function sortIndicator(col: string): string {
    return sortColumn === col
      ? sortDir === "asc"
        ? " ▲"
        : sortDir === "desc"
          ? " ▼"
          : ""
      : "";
  }

  return { sortColumn, sortDir, toggleSort, sortIndicator };
}
