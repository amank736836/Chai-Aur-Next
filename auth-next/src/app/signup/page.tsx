"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    setLoading(true);
    let toastId = toast.loading("Signing up...");
    try {
      const response = await axios.post("/api/users/signup", user);

      console.log("Signed up", response.data);

      if (response.data.success) {
        toast.success("Signed up successfully");
        router.push("/login");
      } else {
        toast.error("Error signing up");
      }
    } catch (error) {
      console.error(error);
      console.log("Error signing up");
      toast.error("Error signing up");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
      user.username = "";
      user.email = "";
      user.password = "";
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0 &&
      !loading
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, loading]);

  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const controller = new AbortController();

  const usernameCheck = async () => {
    try {
      const response = await axios.post(
        "/api/users/username-check",
        {
          username: user.username,
        },
        {
          signal: controller.signal,
        }
      );

      console.log("Username check", response.data);

      if (response.data.success) {
        setUsernameAvailable(true);
      } else {
        setUsernameAvailable(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (user.username.length > 0) {
      const response = usernameCheck();
    }

    return () => {
      controller.abort();
    };
  }, [user.username]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Signup"}</h1>
      <hr />
      <label htmlFor="username">Username</label>
      <input
        className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        type="text"
        id="username"
        value={user.username}
        placeholder="Username"
        required
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      {!usernameAvailable && (
        <p className="text-red-500">Username not available</p>
      )}
      <label htmlFor="email">Email</label>
      <input
        className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        type="email"
        id="email"
        value={user.email}
        placeholder="Email"
        required
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <label htmlFor="password">Password</label>
      <input
        className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        type="password"
        id="password"
        value={user.password}
        placeholder="Password"
        required
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />

      <button
        disabled={buttonDisabled}
        onClick={onSignup}
        className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:bg-red-500
        bg-green-500
        "
      >
        {buttonDisabled
          ? loading
            ? "Processing"
            : "Fill all fields"
          : "Signup"}
      </button>
      <Link href="/login">Visit Login Page</Link>
    </div>
  );
}
