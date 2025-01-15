"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function VerifyEmailPage() {
  const [token, setToken] = useState("");

  const [Verified, setVerified] = useState(false);

  const [error, setError] = useState(false);

  const router = useRouter();

  const verifyUserEmail = async () => {
    const toastId = toast.loading("Verifying email...");
    try {
      const response = await axios.post("/api/users/verify", { token });


      if (response.data.success) {
        setVerified(true);
        setError(false);
        toast.success(response.data.message);
        router.push("/login");
      } else {
        setError(true);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError(true);
      toast.error("Error verifying email");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const params = useSearchParams();
  useEffect(() => {
    const Token = params.get("token") || "";

    if (params.get("token")) {
      setToken(Token);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-4">
      <h1 className="text-4xl">Verify Email</h1>

      <h2 className="p-2 bg-green-500 text-black">
        {token && token.length > 0 ? (
          <button
            onClick={verifyUserEmail}
            disabled={token.length === 0 || error}
            className="p-2 bg-green-500 text disabled:bg-red-500"
          >
            Verify Email
          </button>
        ) : (
          "Invalid token"
        )}
      </h2>

      {Verified && (
        <div>
          <h2>Email verified successfully</h2>
          <Link href="/login">Login</Link>
        </div>
      )}

      {error && (
        <div>
          <h2>Error verifying email</h2>
          <Link href="/login">Login</Link>
        </div>
      )}
    </div>
  );
}

export default VerifyEmailPage;
