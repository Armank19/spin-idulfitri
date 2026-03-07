"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = sessionStorage.getItem("adminAuth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#002D42] text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#DCC37E]">
          Dashboard Admin
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div
          onClick={() => router.push("/admin/spin")}
          className="bg-[#75DEEC] text-black p-6 rounded-2xl cursor-pointer hover:scale-105 transition"
        >
          🎉 Spin Undian
        </div>

        <div className="bg-white text-black p-6 rounded-2xl">
          📊 Statistik Peserta
        </div>
      </div>
    </div>
  );
}