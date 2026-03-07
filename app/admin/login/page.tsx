"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === "BAT1447") {
      sessionStorage.setItem("adminAuth", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#002D42]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80 text-center">
        <h1 className="text-2xl font-bold mb-6 text-[#002D42]">
          Admin Login
        </h1>

        <input
          type="password"
          placeholder="Masukkan Password"
          className="w-full border p-3 rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#DCC37E] text-black py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}