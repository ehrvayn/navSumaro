import React, { useState, useEffect } from "react";
import { Button } from "../ui";
import { usePage } from "../../context/PageContex";
import {
  ArrowRight,
  Rocket,
  MapPin,
  Clock,
  AlignLeft,
  Type,
} from "lucide-react";
import { useEvent } from "../../context/EventContex";

interface AddEventModalProps {
  onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState("#f97316");
  const { activePage } = usePage();

  const { handleCreateEvent } = useEvent();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (activePage !== "calendar") {
      onClose();
    }
  }, [activePage]);

  const handleCreate = () => {
    if (!title.trim() || !startTime) return;
    const d = new Date(startTime);
    handleCreateEvent({
      title,
      description,
      location,
      startTime,
      endTime: endTime || undefined,
      organizerId: "org-001",
      color,
      month: d.toLocaleString("default", { month: "short" }).toUpperCase(),
      day: d.getDate(),
    });
    onClose();
  };

  const colorOptions = [
    { hex: "#f97316", label: "Orange" },
    { hex: "#3b82f6", label: "Blue" },
    { hex: "#22c55e", label: "Green" },
    { hex: "#8b5cf6", label: "Purple" },
    { hex: "#ec4899", label: "Pink" },
    { hex: "#eab308", label: "Yellow" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-base-elevated border border-border-accent rounded-0 md:rounded-lg md:w-[640px] w-full h-[87vh] md:h-[90vh] md:mt-[60px] mt-[120px] overflow-y-auto animate-scaleIn shadow-2xl flex flex-col"
      >
        <div className="flex justify-between items-center px-5 sm:px-7 py-5 border-b border-border sticky top-0 bg-base-elevated z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
              style={{ backgroundColor: color + "22" }}
            >
              <div
                className="w-3 h-3 rounded-full transition-colors duration-200"
                style={{ backgroundColor: color }}
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Post Event Schedule
              </h2>
              <p className="text-[11px] text-text-muted">
                Let students stay updated on Campus Events
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted md:text-[13px] text-[11px] items-center flex gap-1 hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
          >
            Back
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="px-5 sm:px-7 py-5 flex flex-col gap-5 flex-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Type size={11} className="text-text-muted" />
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Event Title
              </span>
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GDSC Dev Fest 2026"
              className="input-base font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <AlignLeft size={11} className="text-text-muted" />
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Description{" "}
                <span className="normal-case tracking-normal font-normal opacity-50">
                  — optional
                </span>
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this event about?"
              rows={4}
              className="input-base resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="text-text-muted" />
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Location{" "}
                <span className="normal-case tracking-normal font-normal opacity-50">
                  — optional
                </span>
              </span>
            </div>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. CCS Computer Laboratory, 2F"
              className="input-base"
            />
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-text-muted" />
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  Start Time
                </span>
              </div>
              <div
                className="input-base text-xs cursor-pointer flex items-center gap-2"
                onClick={() =>
                  (
                    document.getElementById("startTime") as HTMLInputElement
                  )?.showPicker()
                }
              >
                <Clock size={12} className="text-text-muted shrink-0" />
                <span
                  className={
                    startTime ? "text-text-primary" : "text-text-muted"
                  }
                >
                  {startTime
                    ? new Date(startTime).toLocaleString()
                    : "Pick a date & time"}
                </span>
                <input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-text-muted opacity-50" />
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  End Time{" "}
                  <span className="normal-case tracking-normal font-normal opacity-50">
                    — optional
                  </span>
                </span>
              </div>
              <div
                className="input-base text-xs cursor-pointer flex items-center gap-2"
                onClick={() =>
                  (
                    document.getElementById("endTime") as HTMLInputElement
                  )?.showPicker()
                }
              >
                <Clock
                  size={12}
                  className="text-text-muted shrink-0 opacity-50"
                />
                <span
                  className={endTime ? "text-text-primary" : "text-text-muted"}
                >
                  {endTime
                    ? new Date(endTime).toLocaleString()
                    : "Pick a date & time"}
                </span>
                <input
                  id="endTime"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              Event Color
            </span>
            <div className="flex items-center gap-2 p-3 bg-base-surface border border-border rounded-md">
              {colorOptions.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full transition-all duration-150 ${
                    color === c.hex
                      ? "ring-2 ring-offset-2 ring-offset-base-surface scale-110"
                      : "opacity-50 hover:opacity-90 hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: c.hex,
                    outline: color === c.hex ? `2px solid ${c.hex}` : "none",
                    outlineOffset: "2px",
                  }}
                />
              ))}
              <div className="ml-auto flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[11px] text-text-muted font-mono">
                  {color}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 justify-end px-5 sm:px-7 py-5 border-t border-border sticky bottom-0 bg-base-elevated">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || !startTime}>
            <span className="flex items-center gap-1.5">
              <Rocket size={14} />
              Post Event
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
