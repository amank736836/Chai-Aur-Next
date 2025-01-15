"use client";

export default function ProfilePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page </h1>
      <h2 className="p-3 bg-green-500 text-black rounded">
        Profile ID: {params.id}
      </h2>
    </div>
  );
}
