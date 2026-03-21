import React, { createContext, useContext, useState } from "react";
import { Event } from "../types";
import { mockOrganizations } from "../data/mockOrganization";
import { mockEvents } from "../data/mockEvents";

interface GroupContextType {
  handleCreateEvent: (data: Omit<Event, "id" | "createdAt">) => void;
  events: Event[];
  showCreateEvent: boolean;
  setShowCreateEvent: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventContext = createContext<GroupContextType | null>(null);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

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
  if (!context) throw new Error("useGroup must be used inside GroupProvider");
  return context;
};
