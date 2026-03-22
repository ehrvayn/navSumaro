import { ChevronDown, Clock, MapPin } from "lucide-react";
import { Event } from "../../types";
import { mockOrganizations } from "../../data/mockOrganization";
import { useState } from "react";

const orgTypeColor: Record<string, string> = {
  "student-org": "bg-brand/15 text-brand",
  department: "bg-blue-500/15 text-blue-400",
  institution: "bg-purple-500/15 text-purple-400",
};

const orgTypeLabel: Record<string, string> = {
  "student-org": "Student Org",
  department: "Department",
  institution: "Institution",
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const org = event.organizer;
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
  ].indexOf(event.month);
  const d = new Date(2026, monthIndex, event.day);
  const month = event.month.slice(0, 3).toUpperCase();
  const [viewDetails, setViewDetails] = useState(false);

  const badgeClass =
    orgTypeColor[org?.organizationType ?? ""] ?? "bg-gray-500/15 text-gray-400";
  const badgeLabel =
    orgTypeLabel[org?.organizationType ?? ""] ?? "Organization";

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="bg-base-surface border sm:p-4 p-2 animate-fadeIn border-border rounded-md overflow-hidden flex flex-col sm:flex-row gap-0 sm:gap-4 hover:bg-base-hover transition-all cursor-pointer group"
      onClick={() => setViewDetails(!viewDetails)}
    >
      <div
        className="flex sm:flex-col items-center justify-center px-4 py-2 sm:w-16 sm:shrink-0 gap-2 sm:gap-0.5"
        style={{ backgroundColor: event.color + "15" }}
      >
        <span
          className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest"
          style={{ color: event.color }}
        >
          {month}
        </span>
        <span
          className="text-lg sm:text-2xl font-black leading-none"
          style={{ color: event.color }}
        >
          {d.getDate()}
        </span>
      </div>

      <div className="flex-1 p-4 sm:pl-0 sm:py-4 sm:pr-2 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}
            >
              {badgeLabel}
            </span>
            {org?.isVerified && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                ✓ Verified
              </span>
            )}
          </div>

          <button
            className="text-xs font-semibold text-brand hover:text-brand-dark flex items-center gap-1 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setViewDetails(!viewDetails);
            }}
          >
            {viewDetails ? "Less" : "Details"}
            <ChevronDown
              size={14}
              className={`${viewDetails ? "rotate-180" : ""} transition-transform duration-300`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm"
            style={{ backgroundColor: event.color }}
          >
            {org?.name[0]}
          </div>
          <p className="text-xs font-medium text-text-muted italic">
            {org?.name ?? "Unknown Organization"}
          </p>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-text-primary leading-tight mb-1">
          {event.title}
        </h3>

        {event.description && (
          <p
            className={`text-xs sm:text-sm text-text-muted leading-relaxed mb-4 transition-al ${viewDetails ? "text-justify" : "line-clamp-2"}`}
          >
            {event.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-t border-border/50 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
            <Clock size={13} className="text-brand" />
            <span>
              {d.toLocaleDateString("default", {
                month: "short",
                day: "numeric",
              })}
              {" · "}
              {event.startTime}
              <span className="text-lg"> | </span>
              {event.endTime && event.endTime}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
              <MapPin size={13} className="text-brand" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      <div
        className="hidden sm:block w-1.5 shrink-0 self-stretch"
        style={{ backgroundColor: event.color }}
      />
    </div>
  );
};

export default EventCard;
