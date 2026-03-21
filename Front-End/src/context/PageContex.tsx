import React, { createContext, useContext, useState } from "react";
import { Page } from "../types";

interface PageContextType {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const PageContext = createContext<PageContextType | null>(null);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activePage, setActivePage] = useState<Page>("home");

  const handleSetActivePage = (page: Page) => {
    setActivePage(page);
  };

  return (
    <PageContext.Provider
      value={{
        activePage,
        setActivePage: handleSetActivePage,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used inside a PageProvider");
  }
  return context;
};
