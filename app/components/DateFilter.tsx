"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "7"; // 7 days is default... should it be 1 day?

  const filters = [
    { label: "7D", value: "7" },
    { label: "30D", value: "30" },
    { label: "3M", value: "90" },
    { label: "6M", value: "180" },
    { label: "1Y", value: "365" },
    { label: "ALL", value: "all" },
  ];

  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg inline-flex mb-6">
      {filters.map((filter) => {
        const isActive = currentRange === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => router.push(`/?range=${filter.value}`)}
            className={`px-3 py-1 text-sm font-bold rounded-md transition ${
              isActive
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
