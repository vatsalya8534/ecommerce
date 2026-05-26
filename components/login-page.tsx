"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";

type FormMode = "login" | "signup" | "forgot";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<FormMode>("login");

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgotPassword = mode === "forgot";

  const content = {
    login: {
      eyebrow: "Account Login",
      title: "Login to ShopHub",
      description: "Continue shopping and manage your orders easily.",
      submitLabel: "Login",
    },
    signup: {
      eyebrow: "Create Account",
      title: "Join ShopHub",
      description: "Create your account to save carts and track orders.",
      submitLabel: "Create account",
    },
    forgot: {
      eyebrow: "Password Help",
      title: "Reset your password",
      description: "Enter your email and we will send password reset steps.",
      submitLabel: "Send reset link",
    },
  }[mode];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9f4] px-4">
      <section className="w-full max-w-md rounded-[2rem] border border-[#dde4d1] bg-white p-8 shadow-[0_20px_60px_-30px_rgba(31,41,18,0.25)]">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#71805b]">
            {content.eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#14190e]">
            {content.title}
          </h2>

          <p className="mt-3 text-sm text-[#5d6750]">
            {content.description}
          </p>
        </div>

        <form className="mt-8 space-y-5">
          {isSignup ? (
            <div>
              <span className="text-sm font-semibold text-[#223013]">
                Full name
              </span>

              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 px-4 text-sm outline-none focus:border-[#93a374]"
                />
              </div>
            </div>
          ) : null}

          <div>
            <span className="text-sm font-semibold text-[#223013]">
              Email address
            </span>

            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f7c5c]" />

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#93a374]"
              />
            </div>
          </div>

          {!isForgotPassword ? (
            <div>
              <span className="text-sm font-semibold text-[#223013]">
                Password
              </span>

              <div className="relative mt-2">
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f7c5c]" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isSignup ? "Create a password" : "Enter your password"
                  }
                  className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 pl-11 pr-12 text-sm outline-none focus:border-[#93a374]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f7c5c]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ) : null}

          {isSignup ? (
            <div>
              <span className="text-sm font-semibold text-[#223013]">
                Confirm password
              </span>

              <div className="relative mt-2">
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f7c5c]" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#93a374]"
                />
              </div>
            </div>
          ) : null}

          {isLogin ? (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#4f5b41]">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="font-semibold text-[#30411a] hover:text-[#223013]"
              >
                Forgot password?
              </button>
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-full bg-[#2f3b1d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#243015]"
          >
            {content.submitLabel}
          </button>

          <div className="text-center text-sm text-[#5b654d]">
            {isLogin ? (
              <p>
                New here?
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="ml-2 font-semibold text-[#263118] hover:text-[#223013]"
                >
                  Create an account
                </button>
              </p>
            ) : null}

            {isSignup ? (
              <p>
                Already have an account?
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="ml-2 font-semibold text-[#263118] hover:text-[#223013]"
                >
                  Login
                </button>
              </p>
            ) : null}

            {isForgotPassword ? (
              <p>
                Remembered your password?
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="ml-2 font-semibold text-[#263118] hover:text-[#223013]"
                >
                  Back to login
                </button>
              </p>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
