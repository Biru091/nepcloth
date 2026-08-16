"use client";

import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields.");
      return;
    }

    console.log("Login data:", loginData);

    setSuccess("Login form submitted.");
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Register data:", registerData);

    setSuccess("Account created successfully.");
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setError("");
    setSuccess("");
  };

  return (
    <main className="min-h-screen bg-white px-5 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-[0.2em]">
            NEPCLOTH
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {isLogin
              ? "Welcome back to NEPCLOTH"
              : "Create your NEPCLOTH account"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">

          {/* Login / Register Switch */}
          <div className="flex rounded-full bg-gray-100 p-1 mb-8">

            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition ${
                isLogin
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition ${
                !isLogin
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Register
            </button>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          {/* LOGIN */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="text-sm font-medium text-gray-900"
                >
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium text-gray-900"
                >
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="••••••••"
                />
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-black transition"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-900"
              >
                Sign In
              </button>

            </form>
          ) : (

            /* REGISTER */
            <form onSubmit={handleRegister} className="space-y-5">

              {/* Name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="text-sm font-medium text-gray-900"
                >
                  Full Name
                </label>

                <input
                  id="register-name"
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      name: e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Full Name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="text-sm font-medium text-gray-900"
                >
                  Email
                </label>

                <input
                  id="register-email"
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="text-sm font-medium text-gray-900"
                >
                  Password
                </label>

                <input
                  id="register-password"
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Minimum 8 characters"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </label>

                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Repeat password"
                />
              </div>

              {/* Create Account */}
              <button
                type="submit"
                className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-900"
              >
                Create Account
              </button>

            </form>
          )}

          {/* Bottom Switch */}
          <div className="mt-8 text-center text-sm text-gray-500">

            {isLogin ? (
              <>
              Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className="font-semibold text-black hover:underline"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className="font-semibold text-black hover:underline"
                >
                  Login
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}