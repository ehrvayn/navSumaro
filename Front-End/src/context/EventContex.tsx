import React, { createContext, useContext, useEffect, useState } from "react";
import { Event } from "../types";

interface EventContextType {
  handleCreateEvent: (data: Omit<Event, "id" | "createdAt">) => void;
  events: Event[];
  showCreateEvent: boolean;
  setShowCreateEvent: React.Dispatch<React.SetStateAction<boolean>>;
  getEvents: () => void;
}

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:5000/org/event/retrieveAll",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const filteredEvents = data.data.filter((e: Event) => {
            if (!e.endTime) return true;

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
            const eventDate = new Date(2026, monthIndex, e.day);

            const parseTime = (timeStr: string) => {
              const [time, period] = timeStr.split(/(AM|PM)/);
              const [hours, minutes] = time.split(":").map(Number);
              let hour = hours;
              if (period === "PM" && hour !== 12) hour += 12;
              if (period === "AM" && hour === 12) hour = 0;
              eventDate.setHours(hour, minutes, 0);
              return eventDate;
            };

            const endDateTime = parseTime(e.endTime);
            return endDateTime > new Date();
          });
          setEvents(filteredEvents);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateEvent = (data: Omit<Event, "id" | "createdAt">) => {
    const newEvent: Event = {
      ...data,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <EventContext.Provider
      value={{
        getEvents,
        handleCreateEvent,
        events,
        showCreateEvent,
        setShowCreateEvent,
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
