import React, { createContext, useContext, useState } from "react";
import { usePage } from "./PageContex";
import { useCurrentUser } from "./CurrentUserContex";

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
  const { setCurrentUser, refreshUser } = useCurrentUser();
  const [isRegister, setIsRegister] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setActivePage("login");
  };

  const handleLogin = async () => {
    setLoginError("");
    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        setEmail("");
        setPassword("");
        await refreshUser();
        setActivePage("home");
      } else {
        setLoginError(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Something went wrong!");
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