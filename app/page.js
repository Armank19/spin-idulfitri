"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lamp } from "lucide-react";


export default function Home() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    employee_number: "",
    division: "",
    phone: "",
  });

  useEffect(() => {
    getTotal();
  }, []);

  const getTotal = async () => {
    const { count } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    setTotal(count || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("registrations")
      .insert([form]);

    if (error) {
      if (error.message.includes("unique")) {
        setMessage("Nomor karyawan sudah terdaftar.");
      } else {
        setMessage("Terjadi kesalahan, coba lagi.");
      }
    } else {
        setSuccess(true); 
      setMessage("Pendaftaran berhasil!");
      setForm({
        name: "",
        employee_number: "",
        division: "",
        phone: "",
      });
      getTotal();
    }

    setLoading(false);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#002D42] via-[#01354d] to-[#001c2a]">

  {/* Decorative Moon Glow */}
  <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#75DEEC] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] pointer-events-none"></div>

  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#DCC37E] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

  

 

      {/* Header */}
<div className="text-center mb-6 relative z-10">
    

  <h1 className=" text-5xl tracking-wide text-[#FFD369] drop-shadow-[0_0_20px_rgba(255,211,105,0.8)]">
  Semarak Kampung Ramadhan BAT 1447H 
</h1>

  <p className="text-[#75DEEC] mt-2">
    Total Peserta Terdaftar:{" "}
    <span className="font-bold text-white">{total}</span>
  </p>
{success && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
    
    <div className="bg-gradient-to-br from-[#01354d] to-[#002D42] 
                    border border-[#DCC37E]/40 
                    p-8 rounded-2xl 
                    shadow-[0_0_40px_rgba(220,195,126,0.4)] 
                    text-center max-w-sm w-full">
      
      <div className="text-5xl mb-4 animate-bounce">🎉</div>

      <h2 className="text-2xl font-bold text-[#FFD369] mb-2">
        Pendaftaran Berhasil!
      </h2>

      <p className="text-[#75DEEC] mb-6">
        Data kamu sudah tersimpan.
      </p>

      <button
        onClick={() => setSuccess(false)}
        className="px-6 py-2 bg-[#DCC37E] text-black rounded-lg font-semibold hover:scale-105 transition"
      >
        Tutup
      </button>
    </div>

  </div>
)}
</div>

      {/* Card Form */}
      <div className="bg-[#E5ECF3] w-full max-w-md p-6 rounded-2xl shadow-xl">
        <h2 className="text-[#002D42] text-lg font-semibold mb-4 text-center">
          Form Pendaftaran
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value.toUpperCase() })
            }
            required
            className="p-3 rounded-lg border border-gray-300 text-[#002D42] placeholder:text-[#002D42]/50 focus:outline-none focus:ring-2 focus:ring-[#75DEEC]"
          />

          <input
            type="text"
            placeholder="Nomor Karyawan"
            value={form.employee_number}
            onChange={(e) =>
              setForm({ ...form, employee_number: e.target.value })
            }
            required
            className="p-3 rounded-lg border border-gray-300 text-[#002D42] placeholder:text-[#002D42]/50 focus:outline-none focus:ring-2 focus:ring-[#75DEEC]"
          />

          <input
            type="text"
            placeholder="Divisi (contoh: Production line ...)"
            value={form.division}
            onChange={(e) =>
              setForm({ ...form, division: e.target.value.toUpperCase() })
            }
            required
            className="p-3 rounded-lg border border-gray-300 text-[#002D42] placeholder:text-[#002D42]/50 focus:outline-none focus:ring-2 focus:ring-[#75DEEC]"
          />

          <input
            type="text"
            placeholder="Nomor HP Aktif (whatsapp)"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            required
            className="p-3 rounded-lg border border-gray-300 text-[#002D42] placeholder:text-[#002D42]/50 focus:outline-none focus:ring-2 focus:ring-[#75DEEC]"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#DCC37E] hover:opacity-90 text-[#002D42] font-bold py-3 rounded-lg transition"
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-[#002D42] font-medium">
            {message}
          </p>
        )}
      </div>

    </main>
  );
}