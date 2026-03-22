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
} from "lucide-react";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useState } from "react";
import { useLogin } from "../../context/LoginContex";

interface RegisterStudentPageProps {
  onBack: () => void;
  onRegister: (data: any) => void;
}

function RegisterStudentPage({ onBack, onRegister }: RegisterStudentPageProps) {
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

  const handleRegister = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onRegister({
      email,
      password,
      firstname,
      lastname,
      university,
      program,
      yearLevel,
      accountType: "student",
    });
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
    <div className="w-full max-w-[760px] mx-auto flex flex-col gap-6">
      <div className="flex pb-10 flex-col gap-1">
        <h1 className="text-[50px] self-center font-black text-text-primary">
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
                <p className="text-[11px] text-red-400">{errors.firstname}</p>
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
                <p className="text-[11px] text-red-400">{errors.lastname}</p>
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
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
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
              <p className="text-[11px] text-red-400">{errors.university}</p>
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
                  if (errors.program) setErrors((p) => ({ ...p, program: "" }));
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
          onClick={() => {
            setIsRegister(false)
            handleRegister}}
        >
          Create Account
        </button>
        <div className="h-px w-[80%] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        <button
          className="w-full hover:bg-base-hover border border-border text-text-secondary font-semibold text-[13px] py-2.5 rounded-md flex items-center justify-center gap-2"
          onClick={onBack}
        >
          <IoReturnDownBackSharp size={20} />
          Back
        </button>
      </div>
    </div>
  );
}

export default RegisterStudentPage;
