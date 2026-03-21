import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  School,
  User,
  ChevronLeft,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useLogin } from "../context/LoginContex";

function RegisterPage() {
  const [accountType, setAccountType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [university, setUniversity] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setIsRegister } = useLogin();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstname.trim()) newErrors.firstname = "First name is required";
    if (!lastname.trim()) newErrors.lastname = "Last name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Must be a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must contain at least 1 number";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!university.trim()) newErrors.university = "University is required";
    if (!program.trim()) newErrors.program = "Program is required";
    if (!yearLevel) newErrors.yearLevel = "Year level is required";
    return newErrors;
  };

  const handleRegister = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstname,
          lastname,
          university,
          program,
          yearLevel,
          accountType,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (!data.success) {
          alert(data.message);
          return;
        }
        setRegistered(true);
      }
    } catch (error) {
      console.error("Register error", error);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-base border rounded-md pl-9 pr-4 py-2.5 text-[13px] text-text-primary outline-none transition-colors placeholder:text-text-muted/50 ${
      errors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-border focus:border-brand"
    }`;

  const inputClassPr = (field: string) =>
    `w-full bg-base border rounded-md pl-9 pr-10 py-2.5 text-[13px] text-text-primary outline-none transition-colors placeholder:text-text-muted/50 ${
      errors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-border focus:border-brand"
    }`;

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
            <h1 className="text-[20px] sm:text-[30px]  self-center font-black text-text-primary">
              Create Account
            </h1>
            <p className="text-[10px] sm:text-[12px] text-text-muted text-center">
              Choose your account type to get started
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setAccountType("student")}
              className="w-full flex items-center gap-4 p-4 bg-base border border-border hover:border-brand rounded-md transition-colors"
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
            <button
              onClick={() => setAccountType("organization")}
              className="w-full flex items-center gap-4 p-4 bg-base border border-border hover:border-brand rounded-md transition-colors"
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
          <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          <button
            className="w-full hover:bg-base-hover text-[11px] md:text-[13px]  text-text-secondary font-semibold  py-2.5 rounded-md transition-colors"
            onClick={() => setIsRegister(false)}
          >
            Already have an account? Sign in
          </button>
        </div>
      )}

      {accountType === "student" && (
        <div className="w-full max-w-[760px] mx-auto flex flex-col gap-6">
          <div className="flex pb-10 flex-col gap-1">
            <button
              onClick={() => setAccountType("")}
              className="flex items-center gap-1 text-text-muted hover:text-text-primary text-[12px] transition-colors w-fit"
            >
              <ChevronLeft size={14} />
              Back
            </button>
            <h1 className="text-2xl self-center font-black text-text-primary">
              Register
            </h1>
            <span className="text-sm self-center text-brand">Student</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold self-center text-text-muted uppercase tracking-widest mb-[-10px]">
                Personal Info
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    First Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-text-muted pointer-events-none">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      value={firstname}
                      onChange={(e) => {
                        setFirstname(e.target.value);
                        if (errors.firstname)
                          setErrors((p) => ({ ...p, firstname: "" }));
                      }}
                      placeholder="Juan"
                      className={inputClass("firstname")}
                    />
                  </div>
                  {errors.firstname && (
                    <p className="text-[11px] text-red-400">
                      {errors.firstname}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    Last Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-text-muted pointer-events-none">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      value={lastname}
                      onChange={(e) => {
                        setLastname(e.target.value);
                        if (errors.lastname)
                          setErrors((p) => ({ ...p, lastname: "" }));
                      }}
                      placeholder="Dela Cruz"
                      className={inputClass("lastname")}
                    />
                  </div>
                  {errors.lastname && (
                    <p className="text-[11px] text-red-400">
                      {errors.lastname}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Email
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted pointer-events-none">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="example@ncf.edu.ph"
                    className={inputClass("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted pointer-events-none">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: "" }));
                    }}
                    placeholder="••••••••"
                    className={inputClassPr("password")}
                  />
                  <button
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted pointer-events-none">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((p) => ({ ...p, confirmPassword: "" }));
                    }}
                    placeholder="••••••••"
                    className={inputClassPr("confirmPassword")}
                  />
                  <button
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold self-center text-text-muted uppercase tracking-widest mb-[-10px]">
                Academic Info
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  University
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted pointer-events-none">
                    <School size={14} />
                  </span>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => {
                      setUniversity(e.target.value);
                      if (errors.university)
                        setErrors((p) => ({ ...p, university: "" }));
                    }}
                    placeholder="e.g., Naga College Foundation"
                    className={inputClass("university")}
                  />
                </div>
                {errors.university && (
                  <p className="text-[11px] text-red-400">
                    {errors.university}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Program
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted pointer-events-none">
                    <BookOpen size={14} />
                  </span>
                  <input
                    type="text"
                    value={program}
                    onChange={(e) => {
                      setProgram(e.target.value);
                      if (errors.program)
                        setErrors((p) => ({ ...p, program: "" }));
                    }}
                    placeholder="e.g., BS Information Technology"
                    className={inputClass("program")}
                  />
                </div>
                {errors.program && (
                  <p className="text-[11px] text-red-400">{errors.program}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Year Level
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted pointer-events-none">
                    <GraduationCap size={14} />
                  </span>
                  <select
                    value={yearLevel}
                    onChange={(e) => {
                      setYearLevel(Number(e.target.value));
                      if (errors.yearLevel)
                        setErrors((p) => ({ ...p, yearLevel: "" }));
                    }}
                    className={`w-full bg-base border rounded-md pl-9 pr-4 py-2.5 text-[13px] text-text-primary outline-none transition-colors appearance-none ${errors.yearLevel ? "border-red-500" : "border-border focus:border-brand"}`}
                  >
                    <option value="">Select year level</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
                {errors.yearLevel && (
                  <p className="text-[11px] text-red-400">{errors.yearLevel}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center flex-col gap-1">
            <button
              className="w-full bg-brand mb-4 hover:bg-orange-600 text-white font-bold text-[13px] py-2.5 rounded-md transition-colors"
              onClick={handleRegister}
            >
              Create Account
            </button>
            <div className="h-px w-[80%] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            <button
              className="w-full hover:bg-base-hover border border-border text-text-secondary font-semibold text-[13px] py-2.5 rounded-md transition-colors"
              onClick={() => setIsRegister(false)}
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      )}

      {accountType === "organization" && (
        <div className="w-full max-w-[420px] mx-auto flex flex-col gap-4 items-center">
          <button
            onClick={() => setAccountType("")}
            className="flex items-center gap-1 text-text-muted hover:text-text-primary text-[12px] transition-colors w-fit self-start"
          >
            <ChevronLeft size={14} />
            Back
          </button>
          <p className="text-text-muted text-[13px]">
            Organization registration is under development.
          </p>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
