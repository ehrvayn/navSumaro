import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  FileText,
  AlertCircle,
} from "lucide-react";
import api from "../../lib/api";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

interface RegisterOrgProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

function RegisterOrg({ onBack, onRegisterSuccess }: RegisterOrgProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [university, setUniversity] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Organization name is required";
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
    if (!organizationType)
      newErrors.organizationType = "Organization type is required";
    if (!university.trim()) newErrors.university = "University is required";
    if (!description.trim()) newErrors.description = "Description is required";
    return newErrors;
  };

  const handleRegister = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const payload = {
      accountType: "organization",
      name,
      email,
      password,
      organizationType,
      university,
      description,
    };

    try {
      const response = await api.post("/org/register", payload);

      if (response.data.success) {
        onRegisterSuccess();
      } else {
        alert(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
    <div className="w-full mx-auto flex flex-col gap-6">
      <div className="flex pb-10 flex-col gap-1">
        <h1 className="text-[50px] self-center font-black text-text-primary">
          Register
        </h1>
        <span className="text-sm self-center text-brand">Organization</span>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-4 flex gap-3">
        <AlertCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-semibold text-blue-400">
            Verification Process
          </p>
          <p className="text-[11px] text-blue-300 leading-relaxed">
            New organization accounts require at least 3 days of verification
            before receiving a verification badge{" "}
            <span className="inline-flex items-center gap-1">
              <FaCheckCircle className="text-green-500 text-[10px]" />
            </span>
            . Once verified, your organization will gain access to full features
            such as posting an Event.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-bold self-center text-text-muted uppercase tracking-widest mb-[-10px]">
            Organization Info
          </p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Organization Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-text-muted pointer-events-none">
                <Building2 size={14} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                }}
                placeholder="e.g., Computer Science Club"
                className={inputClass("name")}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-red-400">{errors.name}</p>
            )}
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
                placeholder="org@ncf.edu.ph"
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
                type="button"
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
                type="button"
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
            Organization Details
          </p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Organization Type
            </label>
            <select
              value={organizationType}
              onChange={(e) => {
                setOrganizationType(e.target.value);
                if (errors.organizationType)
                  setErrors((p) => ({ ...p, organizationType: "" }));
              }}
              className={`w-full bg-base border rounded-md pl-3 pr-4 py-2.5 text-[13px] text-text-primary outline-none transition-colors appearance-none ${
                errors.organizationType
                  ? "border-red-500"
                  : "border-border focus:border-brand"
              }`}
            >
              <option value="">Select type</option>
              <option value="student-org">Student Organization</option>
              <option value="department">Department</option>
              <option value="institution">Institution</option>
            </select>
            {errors.organizationType && (
              <p className="text-[11px] text-red-400">
                {errors.organizationType}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              University
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-text-muted pointer-events-none">
                <Building2 size={14} />
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
              Description
            </label>
            <div className="relative flex items-start">
              <span className="absolute left-3 top-3 text-text-muted pointer-events-none">
                <FileText size={14} />
              </span>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors((p) => ({ ...p, description: "" }));
                }}
                placeholder="Tell us about your organization..."
                className={`w-full bg-base border rounded-md pl-9 pr-4 py-2.5 text-[13px] text-text-primary outline-none transition-colors placeholder:text-text-muted/50 resize-none h-24 ${
                  errors.description
                    ? "border-red-500 focus:border-red-500"
                    : "border-border focus:border-brand"
                }`}
              />
            </div>
            {errors.description && (
              <p className="text-[11px] text-red-400">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center flex-col gap-1">
        <button
          type="button"
          className="w-full bg-brand mb-4 hover:bg-orange-600 text-white font-bold text-[13px] py-2.5 rounded-md transition-colors disabled:opacity-50"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        <div className="h-px w-[80%] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        <button
          type="button"
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

export default RegisterOrg;