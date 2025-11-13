"use client";
import { useState, useEffect } from "react";

export function SearchBar({
  onSearch,
  delay = 300,
}: {
  onSearch: (query: string) => void;
  delay?: number;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query);
    }, delay);

    return () => clearTimeout(timeout);
  }, [query, delay, onSearch]);

  return (
    <div className="flex items-center p-2 border rounded-2xl shadow-sm w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Token Search ..."
        className="flex-grow p-2 outline-none bg-transparent"
      />
    </div>
  );
}
