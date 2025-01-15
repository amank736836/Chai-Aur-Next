"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    id: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    let toastId = toast.loading("Logging in...");
    try {
      const response = await axios.post("/api/users/login", user);


      if (response.data.success) {
        toast.success("Logged in successfully");
        router.push("/profile");
      } else {
        toast.error("Error signing up");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error signing up");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
      user.id = "";
      user.password = "";
    }
  };

  useEffect(() => {
    if (user.id.length > 0 && user.password.length > 0 && !loading) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Login"}</h1>
      <hr />
      <label htmlFor="id">Username or Email</label>
      <input
        className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        type="text"
        id="id"
        value={user.id}
        placeholder="Email"
        required
        onChange={(e) => setUser({ ...user, id: e.target.value })}
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
        onClick={onLogin}
        className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:bg-red-500
        bg-green-500
        "
      >
        {buttonDisabled
          ? loading
            ? "Processing"
            : "Fill in the details"
          : "Login"}
      </button>
      <Link href="/signup">Visit SignUp Page</Link>
    </div>
  );
}
