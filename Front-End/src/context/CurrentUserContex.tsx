import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../types";
import api from "../lib/api";

interface JWTPayload {
  id: string;
  accountType?: string;
  exp?: number;
}

interface CurrentUserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateCurrentUser: (updates: Partial<User>) => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string, accountType?: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      let endpoint = `/user/retrieve/${userId}`;
      if (accountType === "organization") {
        endpoint = `/org/retrieve/${userId}`;
      }

      const response = await api.get(endpoint);

      if (response.data && response.data.data) {
        setCurrentUser(response.data.data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("token");
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<JWTPayload>(token);

          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            setIsLoading(false);
            return;
          }

          fetchUserProfile(decoded.id, decoded.accountType);
        } catch (error) {
          console.error("Token initialization failed:", error);
          localStorage.removeItem("token");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [fetchUserProfile]);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        await fetchUserProfile(decoded.id, decoded.accountType);
      } catch (e) {
        console.error("Refresh failed", e);
      }
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        updateCurrentUser,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used inside CurrentUserProvider");
  }
  return context;
};