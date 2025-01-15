"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ProfilePage() {
  const router = useRouter();

  const [data, setData] = useState({
    _id: "",
    username: "",
    email: "",
    isVerified: false,
    isAdmin: false,
  });

  const [loading, setLoading] = useState(false);

  const getUserDetails = async () => {
    setLoading(true);
    const toastId = toast.loading("Getting user details...");
    try {
      const response = await axios.get("/api/users/profile");

      console.log("User details", response.data);

      setData(response.data.data);

      if (!response.data.success) {
        toast.error("Error getting user details");
        router.push("/login");
      } else {
        toast.success("User details fetched successfully");
      }
    } catch (error) {
      console.error(error);
      console.log("Error getting user details");
      toast.error("Error getting user details");
      router.push("/login");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");

      console.log("Logged out", response.data);

      if (response.data.success) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error("Error logging out");
      }
    } catch (error) {
      console.error(error);
      console.log("Error logging out");
      toast.error("Error logging out");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-4">
      <h1>Profile Page</h1>
      <hr />
      {data && data.username && data.username.length > 0 && (
        <div>
          <h1>Username: {data.username}</h1>
          <h2>Email: {data.email}</h2>
          <h2>Verified: {data.isVerified ? "Yes" : "No"}</h2>
          <h2>Admin: {data.isAdmin ? "Yes" : "No"}</h2>
          <Link href={`/profile/${data._id}`}>
            <button
              className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500 mr-10"
              disabled={loading && data && data.username.length === 0}
            >
              Edit Profile
            </button>
          </Link>
          <button
            onClick={logout}
            className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500"
            disabled={loading && data && data.username.length === 0}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
