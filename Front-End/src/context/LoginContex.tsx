import React, { createContext, useContext, useState } from "react";
import { usePage } from "./PageContex";
import { useCurrentUser } from "./CurrentUserContex";
import api from "../lib/api";

interface LoginContextType {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: () => Promise<void>;
  showLogout: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  isRegister: boolean;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
  loginError: string;
  setLoginError: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setActivePage } = usePage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser, refreshUser } = useCurrentUser();
  const [isRegister, setIsRegister] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setActivePage("login");
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post("/user/login", { email, password });

      localStorage.setItem("token", response.data.token);
      setEmail("");
      setPassword("");
      await refreshUser();
      setActivePage("home");
      setLoginError("");
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMsg = error.response.data.message || "Login failed!";
        setLoginError(errorMsg);
        console.log(loginError);
      } else {
        setLoginError("Something went wrong!");
        console.error("Network or setup error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        isRegister,
        setIsRegister,
        logout,
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        showLogout,
        setShowLogout,
        loginError,
        setLoginError,
        loading,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) throw new Error("useLogin must be used inside LoginProvider");
  return context;
};
