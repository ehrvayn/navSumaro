import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event } from "../types";
import api from "../lib/api";
import { useCurrentUser } from "./CurrentUserContex";

interface EventContextType {
  handleCreateEvent: (data: Omit<Event, "id" | "createdAt">) => void;
  events: Event[];
  showCreateEvent: boolean;
  setShowCreateEvent: React.Dispatch<React.SetStateAction<boolean>>;
  getEvents: () => void;
  selectedMonth: number | null;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
}

const EventContext = createContext<EventContextType | null>(null);

const MONTHS = [
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
];

const parseEventDateTime = (e: Event) => {
  if (!e.endTime) return null;

  const monthIndex = MONTHS.indexOf(e.month);
  const eventDate = new Date(2026, monthIndex, e.day);

  const match = e.endTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return eventDate;

  let [_, hours, minutes, period] = match;
  let hour = parseInt(hours);
  if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (period.toUpperCase() === "AM" && hour === 12) hour = 0;

  const d = new Date(eventDate);
  d.setHours(hour, parseInt(minutes), 0);
  return d;
};

const fetchEvents = async () => {
  const response = await api.get("/org/event/retrieveAll");
  const data = response.data;

  if (!data.success) return [];

  return data.data.filter((e: Event) => {
    const endDateTime = parseEventDateTime(e);
    if (!endDateTime) return true;
    return endDateTime > new Date();
  });
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const {
    data: events = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["events", currentUser?.id],
    queryFn: fetchEvents,
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: async (newEvent: Omit<Event, "id" | "createdAt">) => {
      return await api.post("/org/event/create", newEvent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", currentUser?.id] });
    },
  });

  const handleCreateEvent = (data: Omit<Event, "id" | "createdAt">) => {
    createMutation.mutate(data);
  };

  return (
    <EventContext.Provider
      value={{
        getEvents: refetch,
        selectedMonth,
        setSelectedMonth,
        handleCreateEvent,
        events,
        showCreateEvent,
        setShowCreateEvent,
        isLoading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvent must be used inside EventProvider");
  return context;
};
