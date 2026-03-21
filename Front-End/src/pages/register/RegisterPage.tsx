import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { useLogin } from "../../context/LoginContex";
import RegisterStudentPage from "./RegisterStudentPage";
import RegisterOrgPage from "./RegisterOrgPage";

function RegisterPage() {
  const [accountType, setAccountType] = useState("");
  const [registered, setRegistered] = useState(false);
  const { setIsRegister } = useLogin();

  const handleStudentRegister = async (data: any) => {
    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        if (!result.success) {
          alert(result.message);
          return;
        }
        setRegistered(true);
      }
    } catch (error) {
      console.error("Register error", error);
    }
  };

  const handleOrgRegister = async (data: any) => {
    try {
      const response = await fetch("http://localhost:5000/organization/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        if (!result.success) {
          alert(result.message);
          return;
        }
        setRegistered(true);
      }
    } catch (error) {
      console.error("Register error", error);
    }
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6">
      {registered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-base-elevated border border-border rounded-md p-8 w-full max-w-[340px] flex flex-col items-center gap-5 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h2 className="text-[16px] font-black text-text-primary">
                Account Created!
              </h2>
              <p className="text-[12px] text-text-muted">
                Welcome to NavSumaro. You can now sign in with your credentials.
              </p>
            </div>
            <button
              className="w-full bg-brand hover:bg-orange-600 text-white font-bold text-[13px] py-2.5 rounded-md transition-colors"
              onClick={() => {
                setRegistered(false);
                setIsRegister(false);
              }}
            >
              Go to Sign In
            </button>
          </div>
        </div>
      )}

      {!accountType && (
        <div className="w-full max-w-[400px] items-center mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] sm:text-[30px] self-center font-black text-text-primary">
              Create Account
            </h1>
            <p className="text-[10px] sm:text-[12px] text-text-muted text-center">
              Choose your account type to get started
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="border border-border rounded-md hover:border-orange-500 transition-colors">
              <button
                onClick={() => setAccountType("student")}
                className="w-full flex items-center gap-4 p-4 bg-base rounded-md"
              >
                <div className="w-10 h-10 rounded-md bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold text-text-primary">
                    Student
                  </p>
                  <p className="text-[11px] text-text-muted">
                    College or university student
                  </p>
                </div>
              </button>
            </div>

            <div className="border border-border rounded-md hover:border-orange-500 transition-colors">
              <button
                onClick={() => setAccountType("organization")}
                className="w-full flex items-center gap-4 p-4 bg-base rounded-md"
              >
                <div className="w-10 h-10 rounded-md bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <Building2 size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold text-text-primary">
                    Organization
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Student org or campus group
                  </p>
                </div>
              </button>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          <button
            className="w-full hover:bg-base-hover text-[11px] md:text-[13px] text-text-secondary font-semibold py-2.5 rounded-md transition-colors"
            onClick={() => setIsRegister(false)}
          >
            Already have an account? <span className="text-orange-500">Sign in</span>
          </button>
        </div>
      )}

      {accountType === "student" && (
        <RegisterStudentPage
          onBack={() => setAccountType("")}
          onRegister={handleStudentRegister}
        />
      )}

      {accountType === "organization" && (
        <RegisterOrgPage
          onBack={() => setAccountType("")}
          onRegister={handleOrgRegister}
        />
      )}
    </div>
  );
}

export default RegisterPage;