"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";

export default function AuthPage() {
  const router = useRouter();

  const { refreshUser } = useAuth();
  const { addToCart } = useCart();

  const [isLogin, setIsLogin] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
   * =====================================================
   * LOGIN DATA
   * =====================================================
   */

  const [loginData, setLoginData] =
    useState({
      email: "",
      password: "",
    });

  /*
   * =====================================================
   * REGISTER DATA
   * =====================================================
   */

  const [registerData, setRegisterData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  /*
   * =====================================================
   * LOGIN
   * =====================================================
   */

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !loginData.email ||
      !loginData.password
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Login failed."
        );

        return;
      }

      /*
       * =================================================
       * LOGIN SUCCESS
       * =================================================
       */

      setSuccess(
        "Login successful!"
      );

      /*
       * Update AuthContext
       */

      await refreshUser();

      /*
       * =================================================
       * CHECK PENDING CART ACTION
       * =================================================
       */

      const pendingAction =
        sessionStorage.getItem(
          "pendingCartAction"
        );

      if (pendingAction) {
        try {
          const action =
            JSON.parse(
              pendingAction
            );

          /*
           * Check saved data
           */

          if (
            action.productId &&
            action.size
          ) {
            /*
             * Add the product to cart
             */

            addToCart(
              action.productId,
              action.size
            );

            /*
             * Remove pending action
             * so it doesn't get added twice.
             */

            sessionStorage.removeItem(
              "pendingCartAction"
            );

            /*
             * Continue original action
             */

            router.push(
              action.redirect ||
                "/"
            );

            return;
          }
        } catch (error) {
          console.error(
            "PENDING CART ERROR:",
            error
          );

          sessionStorage.removeItem(
            "pendingCartAction"
          );
        }
      }

      /*
       * =================================================
       * NORMAL LOGIN REDIRECT
       * =================================================
       */

      const params =
        new URLSearchParams(
          window.location.search
        );

      const redirectTo =
        params.get("redirect") ||
        "/";

      router.push(
        redirectTo
      );

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * REGISTER
   * =====================================================
   */

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    if (
      registerData.password.length < 8
    ) {
      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    if (
      registerData.password !==
      registerData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: registerData.name,
              email:
                registerData.email,
              password:
                registerData.password,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to create account."
        );

        return;
      }

      setSuccess(
        "Account created successfully. You can now login."
      );

      /*
       * Clear register form
       */

      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      /*
       * Switch to login
       */

      setTimeout(() => {
        setIsLogin(true);
        setSuccess("");
      }, 1000);

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(
        "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * SWITCH LOGIN / REGISTER
   * =====================================================
   */

  const switchMode = (
    login: boolean
  ) => {
    setIsLogin(login);

    setError("");
    setSuccess("");
  };

  /*
   * =====================================================
   * UI
   * =====================================================
   */

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-10">

      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold tracking-[0.2em]">
            NEPCLOTH
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {isLogin
              ? "Welcome back to NEPCLOTH"
              : "Create your NEPCLOTH account"}
          </p>

        </div>

        {/* CARD */}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* LOGIN / REGISTER SWITCH */}

          <div className="mb-8 flex rounded-full bg-gray-100 p-1">

            <button
              type="button"
              onClick={() =>
                switchMode(true)
              }
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
              onClick={() =>
                switchMode(false)
              }
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition ${
                !isLogin
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Register
            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          {/* =================================================
              LOGIN FORM
              ================================================= */}

          {isLogin ? (

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}

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
                  autoComplete="email"
                  value={
                    loginData.email
                  }
                  onChange={(e) => {
                    setLoginData({
                      ...loginData,
                      email:
                        e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="you@example.com"
                />

              </div>

              {/* PASSWORD */}

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
                  autoComplete="current-password"
                  value={
                    loginData.password
                  }
                  onChange={(e) => {
                    setLoginData({
                      ...loginData,
                      password:
                        e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="••••••••"
                />

              </div>

              {/* FORGOT PASSWORD */}

              <div className="flex justify-end">

                <button
                  type="button"
                  className="text-sm text-gray-500 transition hover:text-black"
                >
                  Forgot password?
                </button>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>

            </form>

          ) : (

            /* =================================================
               REGISTER FORM
               ================================================= */

            <form
              onSubmit={handleRegister}
              className="space-y-5"
            >

              {/* NAME */}

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
                  autoComplete="name"
                  value={
                    registerData.name
                  }
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      name:
                        e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Full Name"
                />

              </div>

              {/* EMAIL */}

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
                  autoComplete="email"
                  value={
                    registerData.email
                  }
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      email:
                        e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="you@example.com"
                />

              </div>

              {/* PASSWORD */}

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
                  autoComplete="new-password"
                  value={
                    registerData.password
                  }
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      password:
                        e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Minimum 8 characters"
                />

              </div>

              {/* CONFIRM PASSWORD */}

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
                  autoComplete="new-password"
                  value={
                    registerData.confirmPassword
                  }
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      confirmPassword:
                        e.target.value,
                    });

                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Repeat password"
                />

              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>
          )}

          {/* BOTTOM SWITCH */}

          <div className="mt-8 text-center text-sm text-gray-500">

            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    switchMode(false)
                  }
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
                  onClick={() =>
                    switchMode(true)
                  }
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