"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SearchBar } from "@/components/ui/search";
import { SiteHeader } from "@/components/site-header";
import { useState } from "react";
import data from "./data.json";

export default function Page() {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearch(query);

  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectName = (name: string) => {
    console.log("Select Name:", name);
    setSelectedName(name);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <div className="flex flex-1 flex-col gap-2 @container/main">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive selectedName={selectedName} />
          </div>

          {/* Search Bar */}
          <div className="px-4 lg:px-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Filter Table */}
          <DataTable data={filteredData} onSelectName={handleSelectName} />
        </div>
      </div>
    </div>
  );
}
