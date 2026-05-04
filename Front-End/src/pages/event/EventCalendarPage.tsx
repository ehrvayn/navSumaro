import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Event } from "../../types";
import { useEvent } from "../../context/EventContex";
import EventCard from "./EventCard";
import EventSidebar from "./EventSidebar";

type EventFilter = "all" | "student-org" | "department" | "institution";

const CalendarPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");

  const [search, setSearch] = useState("");
  const { events, selectedMonth, setSelectedMonth } = useEvent();

  const filtered = events.filter((e) => {
    if (activeFilter !== "all") {
      if (e.organizer?.organizationType !== activeFilter) return false;
    }
    if (selectedMonth !== null) {
      const monthIndex = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].indexOf(e.month);
      if (monthIndex !== selectedMonth) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const grouped = filtered.reduce<Record<string, Event[]>>((acc, ev) => {
    const monthIndex = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(ev.month);
    const d = new Date(2026, monthIndex, ev.day);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  const groupEntries = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const hasActiveFilters =
    activeFilter !== "all" || selectedMonth !== null || search;

  const clearAll = () => {
    setActiveFilter("all");
    setSelectedMonth(null);
    setSearch("");
  };

  return (
    <div
      className="h-[calc(100vh-60px)] overflow-y-auto"
      style={{ scrollbarGutter: "stable both-edges" }}
    >
      <div className="max-w-6xl mx-auto px-1 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
          
          <EventSidebar
            filtered={filtered}
            activeFilter={activeFilter}
            hasActiveFilters={hasActiveFilters}
            setActiveFilter={setActiveFilter}
            clearAll={clearAll}
            search={search}
            setSearch={setSearch}
          />

          <main className="py-8 min-h-screen">
            {filtered.length === 0 ? (
              <div className="bg-base-surface border border-border border-dashed rounded-2xl flex flex-col items-center justify-center py-24 px-6 text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-base-hover flex items-center justify-center text-text-muted">
                  <CalendarDays size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    No events found
                  </p>
                  <p className="text-xs text-text-muted mt-1 max-w-[200px] leading-relaxed">
                    {search
                      ? "Try a different search term."
                      : "Try adjusting your filters."}
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-brand font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {groupEntries.map(([key, groupEvents]) => {
                  const [yr, mo] = key.split("-").map(Number);
                  const label = new Date(yr, mo, 1).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  });
                  return (
                    <section key={key} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] shrink-0">
                          {label}
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                        <span className="text-[10px] text-text-muted shrink-0">
                          {groupEvents.length} event
                          {groupEvents.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {groupEvents.map((ev) => (
                          <EventCard key={ev.id} event={ev} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
