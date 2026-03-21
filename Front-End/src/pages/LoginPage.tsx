import React, { useState } from "react";
import Logo from "../assets/img/Logo.png";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useLogin } from "../context/LoginContex";
import RegisterPage from "./RegisterPage";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    isRegister,
    setIsRegister,
  } = useLogin();

  return (
    <div className={`min-h-screen bg-base ${isRegister ? "flex items-start justify-center py-8 px-4" : "grid grid-cols-1 lg:grid-cols-2"}`}>
      {!isRegister ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 min-h-screen relative overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none lg:hidden" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none lg:hidden" />

          <div className="w-full max-w-[360px] flex flex-col gap-6 bg-base-elevated lg:bg-transparent border border-border lg:border-none rounded-md lg:rounded-none p-6 lg:p-0 shadow-xl lg:shadow-none relative z-10">
            <div className="lg:hidden flex justify-center">
              <img src={Logo} className="w-[150px]" />
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl self-center font-black text-text-primary">
                Welcome back!
              </h1>
              <p className="text-[12px] text-text-muted text-center">
                Sign in to your NavSumaro account
              </p>
            </div>

            <div className="flex flex-col gap-4">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@ncf.edu.ph"
                    className="w-full bg-base border border-border rounded-md pl-9 pr-4 py-2.5 text-[13px] text-text-primary outline-none focus:border-brand transition-colors placeholder:text-text-muted/50"
                  />
                </div>
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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-base border border-border rounded-md pl-9 pr-10 py-2.5 text-[13px] text-text-primary outline-none focus:border-brand transition-colors placeholder:text-text-muted/50"
                  />
                  <button
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="w-full bg-brand hover:bg-orange-600 text-white font-bold text-[13px] py-2.5 rounded-md transition-colors"
                onClick={handleLogin}
              >
                Sign In
              </button>
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-text-muted">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <button
                className="w-full hover:bg-base-hover border border-border text-text-secondary font-semibold text-[13px] py-2.5 rounded-md transition-colors"
                onClick={() => setIsRegister(true)}
              >
                Create an account
              </button>
            </div>

            <p className="text-center text-[11px] text-text-muted leading-relaxed">
              Use your institutional email{" "}
              <span className="text-brand">@ncf.edu.ph</span> to get a verified
              badge on your account.
            </p>
          </div>

          <footer className="mt-8 flex lg:hidden justify-center w-full px-6">
            <div className="w-full max-w-[700px] border-t border-border pt-4">
              <p className="text-[11px] text-text-muted text-center">
                © 2026 NavSumaro
              </p>
            </div>
          </footer>
        </div>
      ) : (
        <div className="w-full max-w-[760px] mx-auto">
          <RegisterPage />
        </div>
      )}

      {!isRegister && (
        <div className="hidden lg:flex flex-col justify-between p-12 bg-base-elevated border-l border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

          <img src={Logo} className="w-[160px] relative z-10" />

          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-brand text-[11px] font-bold uppercase tracking-widest">
                Integrated Academic Platform
              </div>
              <h2 className="text-3xl font-black text-text-primary leading-tight">
                One platform.
                <br />
                Your entire campus.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  emoji: "🎓",
                  label: "Academic Forums",
                  desc: "Q&A with upvoting & reputation points",
                },
                {
                  emoji: "🛒",
                  label: "Safe Marketplace",
                  desc: "Buy & sell with verified students only",
                },
                {
                  emoji: "👥",
                  label: "Group Activities",
                  desc: "Collaborate with verified classmates",
                },
                {
                  emoji: "📅",
                  label: "Campus Events",
                  desc: "Never miss org announcements",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-base/50 border border-border items-center rounded-md p-3.5 flex gap-1.5"
                >
                  <span className="text-[35px]">{item.emoji}</span>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-text-primary">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-text-muted relative z-10">
            © 2026 NavSumaro
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginPage;