import React, { useState } from "react";
import Logo from "../assets/img/Logo.png";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useLogin } from "../context/LoginContex";
import RegisterPage from "./register/RegisterPage";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    isRegister,
    setIsRegister,
    loading,
    loginError,
    setLoginError,
  } = useLogin();

  if (isRegister) {
    return <RegisterPage />;
  }

  return (
    <div className="min-h-screen bg-base flex flex-col lg:grid lg:grid-cols-[1.2fr_1fr] overflow-hidden">
      <div className="hidden lg:flex flex-col justify-between p-14 bg-gradient-to-b from-base to-[#0d1117] border-r border-border/30">
        <div className="space-y-16">
          <img src={Logo} alt="NavSumaro" className="w-44" />

          <div className="space-y-10">
            <div className="space-y-4">
              <p className="text-orange-500 text-sm font-bold tracking-widest uppercase">
                Integrated Campus Platform
              </p>
              <h1 className="text-4xl font-black text-text-primary leading-tight">
                Academic forums. Marketplace. Events. Collaborations
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                  All in one.
                </span>
              </h1>
              <p className="text-text-muted text-base leading-relaxed max-w-lg">
                NavSumaro connects your entire campus community. Ask questions,
                buy and sell safely, discover events, and collaborate with
                verified classmates.
              </p>
            </div>

            <div className="space-y-3 pt-6">
              {[
                {
                  num: "01",
                  title: "Q&A Forums",
                  desc: "Reputation-based discussions with verified answers",
                },
                {
                  num: "02",
                  title: "Safe Marketplace",
                  desc: "Buy, sell, trade with your campus community",
                },
                {
                  num: "03",
                  title: "Campus Events",
                  desc: "Never miss organization announcements",
                },
              ].map((item) => (
                <div key={item.num} className="flex gap-6 group cursor-pointer">
                  <div className="text-orange-500/60 flex items-center group-hover:text-orange-500 transition-colors text-lg font-black tracking-tight font-mono">
                    {item.num}
                  </div>
                  <div className="flex-1 border-l-2 pl-6 py-2 border-orange-500/30 transition-colors">
                    <p className="font-semibold text-text-primary text-sm">
                      {item.title}
                    </p>
                    <p className="text-text-muted text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="">
          <p className="text-text-muted text-xs">
            © 2026 NavSumaro | All rights reserved.
          </p>
        </div>
      </div>

      {/* Login */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12 flex justify-center">
            <img src={Logo} className="w-40 drop-shadow-lg" />
          </div>

          <div className="bg-gradient-to-br from-base-surface/80 to-base-surface border border-orange-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-black text-text-primary">
                  Welcome
                </h2>
                <p className="text-sm text-text-muted">
                  Sign in to your NavSumaro account
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wide">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (loginError) setLoginError("");
                      }}
                      placeholder="you@ncf.edu.ph"
                      className={`w-full bg-base border-2 rounded-lg pl-11 pr-4 py-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted/50 ${
                        loginError === "Email doesn't Exist!"
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-brand"
                      }`}
                    />
                  </div>
                  {loginError === "Email doesn't Exist!" && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{loginError}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (loginError) setLoginError("");
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-base border-2 rounded-lg pl-11 pr-12 py-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted/50 ${
                        loginError === "Wrong password!"
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-brand"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {loginError === "Wrong password!" && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{loginError}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand to-orange-600 hover:from-orange-600 hover:to-brand text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-brand/30 active:scale-95"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-text-muted">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                onClick={() => setIsRegister(true)}
                className="w-full border-2 border-border hover:border-brand hover:bg-brand/5 text-text-secondary hover:text-brand font-semibold py-3 rounded-lg transition-all"
              >
                Create Account
              </button>

              <p className="text-center text-xs text-text-muted leading-relaxed">
                Use your institutional email{" "}
                <span className="text-brand font-bold">@ncf.edu.ph</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
