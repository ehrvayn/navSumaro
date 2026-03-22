import React, { useState } from "react";
import {
  Filter,
  CalendarDays,
  ChevronDown,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Event } from "../../types";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { useEvent } from "../../context/EventContex";
import EventCard from "./EventCard";

type EventFilter = "all" | "student-org" | "department" | "institution";

const filters: { value: EventFilter; label: string; color: string }[] = [
  {
    value: "all",
    label: "All Events",
    color: "text-brand border-brand bg-brand/10",
  },
  {
    value: "student-org",
    label: "Student Orgs",
    color: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  },
  {
    value: "department",
    label: "Departments",
    color: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  },
  {
    value: "institution",
    label: "Institution",
    color: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CalendarPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const { setShowCreateEvent, events } = useEvent();
  const { currentUser } = useCurrentUser();

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

  const activeFilterObj = filters.find((f) => f.value === activeFilter)!;
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
          <aside className="lg:sticky lg:top-0 py-8 space-y-4">
            <div className="flex items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-md bg-brand/10 flex items-center justify-center text-brand shrink-0">
                <CalendarDays size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-base font-black text-text-primary tracking-tight">
                  Campus Events
                </h1>
                <p className="text-[11px] text-text-muted">
                  {filtered.length} scheduled
                </p>
              </div>
            </div>

            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full bg-base-surface border border-border rounded-md pl-8 pr-3 py-2.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-brand/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md border font-bold text-[11px] transition-all ${
                  showFilters || activeFilter !== "all"
                    ? "bg-brand text-white border-brand"
                    : "bg-base-surface border-border text-text-muted hover:border-brand/30 hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter size={12} />
                  <span>Filter by type</span>
                  {activeFilter !== "all" && (
                    <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[9px]">
                      1
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {showFilters && (
                <div className="p-1 bg-base-surface border border-border rounded-md flex flex-col gap-0.5">
                  {filters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setActiveFilter(f.value)}
                      className={`px-3 py-2 rounded-lg text-[11px] font-semibold text-left transition-all flex items-center gap-2 ${
                        activeFilter === f.value
                          ? f.color
                          : "text-text-muted hover:bg-base-hover hover:text-text-primary"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          activeFilter === f.value
                            ? "opacity-100"
                            : "opacity-30"
                        } ${
                          f.value === "all"
                            ? "bg-brand"
                            : f.value === "student-org"
                              ? "bg-orange-400"
                              : f.value === "department"
                                ? "bg-blue-400"
                                : "bg-purple-400"
                        }`}
                      />
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setShowDateFilter((v) => !v)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md border font-bold text-[11px] transition-all ${
                  showDateFilter || selectedMonth !== null
                    ? "bg-brand text-white border-brand"
                    : "bg-base-surface border-border text-text-muted hover:border-brand/30 hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CalendarDays size={12} />
                  <span>
                    {selectedMonth !== null
                      ? `${MONTHS[selectedMonth]} ${selectedYear}`
                      : "Filter by month"}
                  </span>
                  {selectedMonth !== null && (
                    <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[9px]">
                      1
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${showDateFilter ? "rotate-180" : ""}`}
                />
              </button>

              {showDateFilter && (
                <div className="p-3 bg-base-surface border border-border rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedYear((y) => y - 1)}
                      className="w-7 h-7 rounded-lg bg-base-hover text-text-muted hover:text-text-primary transition-all text-sm font-bold flex items-center justify-center"
                    >
                      ‹
                    </button>
                    <span className="text-xs font-black text-text-primary">
                      {selectedYear}
                    </span>
                    <button
                      onClick={() => setSelectedYear((y) => y + 1)}
                      className="w-7 h-7 rounded-lg bg-base-hover text-text-muted hover:text-text-primary transition-all text-sm font-bold flex items-center justify-center"
                    >
                      ›
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1">
                    {MONTHS.map((m, i) => (
                      <button
                        key={m}
                        onClick={() =>
                          setSelectedMonth(selectedMonth === i ? null : i)
                        }
                        className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          selectedMonth === i
                            ? "bg-brand text-white"
                            : "text-text-muted hover:bg-base-hover hover:text-text-primary"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {selectedMonth !== null && (
                    <button
                      onClick={() => setSelectedMonth(null)}
                      className="w-full text-[10px] text-text-muted hover:text-brand transition-colors font-semibold"
                    >
                      Clear month filter
                    </button>
                  )}
                </div>
              )}
            </div>

            {currentUser?.accountType === "organization" && (
              <button
                onClick={() => setShowCreateEvent(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand text-white rounded-md text-xs font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 active:scale-95"
              >
                <Plus size={14} />
                Post an Event
              </button>
            )}

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5">
                {activeFilter !== "all" && (
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-semibold ${activeFilterObj.color}`}
                  >
                    {activeFilterObj.label}
                    <button
                      onClick={() => setActiveFilter("all")}
                      className="hover:opacity-70"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {selectedMonth !== null && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-semibold text-brand border-brand/30 bg-brand/10">
                    {MONTHS[selectedMonth]} {selectedYear}
                    <button
                      onClick={() => setSelectedMonth(null)}
                      className="hover:opacity-70"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAll}
                  className="text-[10px] text-text-muted hover:text-brand font-semibold underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </aside>

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
