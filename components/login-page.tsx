"use client"

import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react"
import Link from "next/link"
import { useActionState, useState } from "react"

import { signInAction, signUpAction, type AuthActionState } from "@/lib/auth-actions"

type FormMode = "login" | "signup" | "forgot"

type LoginPageProps = {
  initialMode?: FormMode
  successMessage?: string
  redirectTo?: string
}

const initialState: AuthActionState = {}

export function LoginPage({
  initialMode = "login",
  successMessage,
  redirectTo,
}: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<FormMode>(initialMode)
  const [loginState, loginAction, loginPending] = useActionState(
    signInAction,
    initialState,
  )
  const [signupState, signupAction, signupPending] = useActionState(
    signUpAction,
    initialState,
  )

  const isLogin = mode === "login"
  const isSignup = mode === "signup"
  const isForgotPassword = mode === "forgot"

  const content = {
    login: {
      eyebrow: "Account Login",
      title: "Welcome back to ShopHub",
      description:
        "Use your email and password to continue into your customer dashboard.",
      submitLabel: "Login",
    },
    signup: {
      eyebrow: "Create Account",
      title: "Join ShopHub",
      description:
        "Create your account once, then log back in with the same details.",
      submitLabel: "Create account",
    },
    forgot: {
      eyebrow: "Password Help",
      title: "Need help signing in?",
      description:
        "Password reset is not wired yet. Use your account credentials or create a new account.",
      submitLabel: "Back to login",
    },
  }[mode]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(199,214,179,0.45),_transparent_34%),linear-gradient(180deg,_#f8fbf3_0%,_#eef3e6_100%)] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <section className="rounded-[2rem] border border-[#d8e0cb] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(31,41,18,0.22)] sm:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#738160]">
              {content.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#12180b]">
              {content.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5d6750]">{content.description}</p>
          </div>

          {successMessage ? (
            <div className="mt-6 rounded-2xl border border-[#cfe0b6] bg-[#f4faea] px-4 py-3 text-sm text-[#31411f]">
              {successMessage}
            </div>
          ) : null}

          <div className="mt-7">
            {isLogin ? (
              <form action={loginAction} className="space-y-5">
                {loginState.error ? (
                  <div className="rounded-2xl border border-[#f0c8c8] bg-[#fff6f6] px-4 py-3 text-sm text-[#8d2c2c]">
                    {loginState.error}
                  </div>
                ) : null}
                <input type="hidden" name="redirect" value={redirectTo ?? ""} />

                <FieldSet label="Email address" icon={Mail}>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#93a374]"
                    required
                  />
                </FieldSet>

                <FieldSet label="Password" icon={LockKeyhole}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 pl-11 pr-12 text-sm outline-none transition focus:border-[#93a374]"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f7c5c]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </FieldSet>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-[#4f5b41]">
                    <input type="checkbox" className="rounded border-[#cad2bb]" />
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

                <button
                  type="submit"
                  disabled={loginPending}
                  className="w-full rounded-full bg-[#2f3b1d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#243015] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loginPending ? "Signing in..." : content.submitLabel}
                </button>
              </form>
            ) : null}

            {isSignup ? (
              <form action={signupAction} className="space-y-5">
                {signupState.error ? (
                  <div className="rounded-2xl border border-[#f0c8c8] bg-[#fff6f6] px-4 py-3 text-sm text-[#8d2c2c]">
                    {signupState.error}
                  </div>
                ) : null}
                <input type="hidden" name="redirect" value={redirectTo ?? ""} />

                <FieldSet label="Full name" icon={UserRound}>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#93a374]"
                    required
                  />
                </FieldSet>

                <FieldSet label="Email address" icon={Mail}>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#93a374]"
                    required
                  />
                </FieldSet>

                <FieldSet label="Password" icon={LockKeyhole}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#93a374]"
                    required
                  />
                </FieldSet>

                <FieldSet label="Confirm password" icon={LockKeyhole}>
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-[#d8dfcc] bg-[#fbfcf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#93a374]"
                    required
                  />
                </FieldSet>

                <button
                  type="submit"
                  disabled={signupPending}
                  className="w-full rounded-full bg-[#2f3b1d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#243015] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {signupPending ? "Creating account..." : content.submitLabel}
                </button>
              </form>
            ) : null}

            {isForgotPassword ? (
              <div className="space-y-4 rounded-3xl border border-[#dde5d1] bg-[#f8faf4] p-5">
                <p className="text-sm leading-6 text-[#4f5b41]">
                  Password recovery is not wired yet. If you already have an
                  account, switch back to login. Otherwise create a new account and
                  then sign in with your valid credentials.
                </p>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="rounded-full bg-[#2f3b1d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#243015]"
                >
                  Back to login
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-6 text-center text-sm text-[#5b654d]">
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

            <p className="mt-2">
              Want to browse first?
              <Link
                href="/"
                className="ml-2 font-semibold text-[#263118] hover:text-[#223013]"
              >
                Back to store
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function FieldSet({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#223013]">{label}</span>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f7c5c]" />
        {children}
      </div>
    </label>
  )
}
