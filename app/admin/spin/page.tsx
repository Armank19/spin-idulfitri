"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SpinPage() {
  const router = useRouter();

  const [totalParticipants, setTotalParticipants] = useState(0);
  const [displayNumber, setDisplayNumber] = useState("000");
  const [spinning, setSpinning] = useState(false);
  const [spinDuration, setSpinDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState("05 s");
  const [history, setHistory] = useState<any[]>([]);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const [pasteText, setPasteText] = useState("");
const [participants, setParticipants] = useState<number[]>([]);

  const spinRef = useRef<NodeJS.Timeout | null>(null);
  const drumRef = useRef<HTMLAudioElement | null>(null);
const winRef = useRef<HTMLAudioElement | null>(null);
const [muteDrum, setMuteDrum] = useState(false);
const [muteWin, setMuteWin] = useState(false);
  // ================= FETCH DATA =================

  useEffect(() => {
    fetchParticipants();
    fetchHistory();
  }, []);

useEffect(() => {
  drumRef.current = new Audio("/sounds/drum-roll.mp3");
  drumRef.current.loop = true;
  drumRef.current.volume = 0.8;

  winRef.current = new Audio("/sounds/win.mp3");
  winRef.current.volume = 1;
}, []);

  async function fetchParticipants() {
    const { data } = await supabase
      .from("registrations")
.select("lottery_number");

    if (data) setTotalParticipants(data.length);
  }

  async function fetchHistory() {
    const { data } = await supabase
      .from("winners")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setHistory(data);
  }

  useEffect(() => {
  if (drumRef.current) {
    drumRef.current.muted = muteDrum;
  }
}, [muteDrum]);

useEffect(() => {
  if (winRef.current) {
    winRef.current.muted = muteWin;
  }
}, [muteWin]);

  // ================= TIMER CONTROL =================
const loadParticipants = () => {

  const codes = pasteText
    .split(/[\s,]+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const numbers = codes
    .map((code) => {
      const last = code.split("-").pop();
      return Number(last);
    })
    .filter((num) => !isNaN(num));

  setParticipants(numbers);
  setTotalParticipants(numbers.length);

  alert(`Loaded ${numbers.length} participants`);
};


  const increaseDuration = () => {
    if (spinning) return;
    const next = Math.min(spinDuration + 1, 30);
    setSpinDuration(next);
    setTimeLeft(`${next.toString().padStart(2, "0")} s`);
  };

  const decreaseDuration = () => {
    if (spinning) return;
    const next = Math.max(spinDuration - 1, 1);
    setSpinDuration(next);
    setTimeLeft(`${next.toString().padStart(2, "0")} s`);
  };

  // ================= START SPIN ================
  const formatNumber = (num: number | string) => {
  const n = Number(num);

  if (n < 1000) {
    return n.toString().padStart(3, "0");
  }

  return n.toString();
};
  // ================= START SPIN =================
const startSpin = async () => {
  if (spinning) return;

  setSpinning(true);

  try {
    await drumRef.current?.play();
  } catch (e) {
    console.log("Audio blocked:", e);
  }

  // ambil semua peserta
  const list = participants;

  // ambil semua pemenang
  const { data: winners } = await supabase
    .from("winners")
    .select("winning_num");

  const winnerNumbers =
    winners?.map((w: any) => Number(w.winning_num)) || [];

  if (!participants || participants.length === 0) {
    alert("Tidak ada peserta!");
    drumRef.current?.pause();
    setSpinning(false);
    return;
  }



  const codes = pasteText
    .split(/[\s,]+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const numbers = codes
    .map((code) => {
      const lastPart = code.split("-").pop();
      return Number(lastPart);
    })
    .filter((num) => !isNaN(num));

  setParticipants(numbers);
  setTotalParticipants(numbers.length);

  alert(`Loaded ${numbers.length} participants`);

};


  const available = participants.filter(
  (num: number) =>
    !isNaN(num) &&
    num > 0 &&
    !winnerNumbers.includes(num)
);

  if (available.length === 0) {
    alert("Tidak ada nomor yang bisa diundi!");
    drumRef.current?.pause();
    setSpinning(false);
    return;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  const finalNumber = available[randomIndex];

  const formattedFinal = formatNumber(finalNumber);

  runSpinAnimation(formattedFinal);
};


const runSpinAnimation = (finalNumber: string) => {
  let intervalTime = 50;
  let elapsed = 0;
  const totalTime = spinDuration * 1000;

  spinRef.current = setInterval(() => {
    const random =
  participants[Math.floor(Math.random() * participants.length)];

setDisplayNumber(
  formatNumber(random)
);

    setScale(1 + Math.random() * 0.3);
    setRotate(Math.random() * 20 - 10);

    elapsed += intervalTime;

    const remaining = Math.max(
      0,
      spinDuration - Math.floor(elapsed / 1000)
    );

    setTimeLeft(
      `${remaining.toString().padStart(2, "0")} s`
    );

    if (elapsed > totalTime * 0.7) {
      intervalTime += 20;
    }

    if (elapsed >= totalTime) {
      clearInterval(spinRef.current!);
      finishSpin(finalNumber);
    }
  }, intervalTime);
};


const finishSpin = async (winnerNumber: string) => {
  // stop drum
  drumRef.current?.pause();
  drumRef.current!.currentTime = 0;

  // play win sound
  try {
    await winRef.current?.play();
  } catch (e) {
    console.log("Win sound blocked:", e);
  }

  const { data, error } = await supabase
    .from("winners")
    .insert([
      {
        winning_num: winnerNumber,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
  }

  if (data) {
    setHistory((prev) => [data, ...prev]);
  }

 setDisplayNumber(formatNumber(Number(winnerNumber)));

  setScale(1.3);
  setRotate(0);

  setTimeout(() => {
    setScale(1);
  }, 300);

  setSpinning(false);
  setTimeLeft(
    `${spinDuration.toString().padStart(2, "0")} s`
  );
};

    

  // ================= DELETE =================
  const deleteWinner = async (id: number) => {
    await supabase.from("winners").delete().eq("id", id);
    setHistory((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

return (
  <div className="min-h-screen bg-[#002D42] text-white p-6 flex flex-col">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">
        🎉 SPIN UNDIAN RAMADHAN
      </h1>

      <button
        onClick={() => router.push("/admin")}
        className="bg-[#DCC37E] text-black px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
      >
        ← Dashboard
      </button>
    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-[380px_1fr] grid-rows-[320px_1fr] gap-6 flex-1 h-[calc(100vh-120px)]">



     <div className="col-start-1 row-start-2">
      
  <h2 className="font-bold text-lg mb-3 text-center">
    📋 Input Nomor Peserta
  </h2>

  <textarea
    value={pasteText}
    onChange={(e) => setPasteText(e.target.value)}
    placeholder="Paste kode peserta di sini..."
    className="flex-1 w-full border rounded-lg p-3 resize-none"
  />

  <button
    onClick={loadParticipants}
    className="mt-3 bg-[#DCC37E] text-black py-2 rounded-lg font-bold hover:scale-105 transition"
  >
    LOAD DATA
  </button>

  <p className="text-center text-sm mt-2">
    Total Peserta: <b>{totalParticipants}</b>
  </p>

</div>


      {/* ================= LEFT HISTORY ================= */}
      <div className="bg-white text-black rounded-xl p-4 shadow-lg flex flex-col overflow-hidden">

  <h2 className="font-bold text-lg mb-3 text-center">
    🏆 Riwayat Pemenang
  </h2>

  <div className="flex-1 overflow-y-auto space-y-2 pr-1">

    {history.length === 0 && (
      <p className="text-center text-gray-500 text-sm">
        Belum ada pemenang
      </p>
    )}

    {history.map((item) => (
      <div
        key={item.id}
        className="flex justify-between items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <span className="font-bold">
          {formatNumber(item.winning_num)}
        </span>

        <button
          onClick={() => deleteWinner(item.id)}
          className="text-red-500 text-sm hover:scale-110 transition"
        >
          ✕
        </button>
      </div>
    ))}

  </div>

</div>

      {/* ================= RIGHT SPIN AREA ================= */}



      <div className="col-start-2 row-span-2 flex flex-col items-center justify-center">
        
        <p className="mb-6">
          Total Peserta:{" "}
          <span className="text-[#DCC37E] font-bold">
            {totalParticipants}
          </span>
        </p>

        {/* Display */}
        <div className="flex justify-center mb-8">
  <div
    style={{
      transform: `scale(${scale}) rotate(${rotate}deg)`
    }}
    className="w-72 h-72 bg-white text-black rounded-full flex items-center justify-center text-7xl font-bold shadow-[0_0_80px_#DCC37E] transition-all duration-200"
  >
    {displayNumber}
  </div>
</div>

        {/* Timer */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={decreaseDuration}
            className="bg-red-500 px-4 py-2 rounded hover:scale-110 transition"
          >
            -
          </button>

          <span className="text-xl font-bold">
            {timeLeft}
          </span>

          <button
            onClick={increaseDuration}
            className="bg-green-500 px-4 py-2 rounded hover:scale-110 transition"
          >
            +
          </button>
        </div>

        {/* Spin */}
        <button
          onClick={startSpin}
          disabled={spinning}
          className={`px-12 py-4 rounded-xl text-xl font-bold transition ${
            spinning
              ? "bg-gray-500"
              : "bg-[#DCC37E] text-black hover:scale-105"
          }`}
        >
          {spinning ? "Spinning..." : "SPIN"}
        </button>
<div className="flex gap-4 mt-6">
  <button
    onClick={() => setMuteDrum(!muteDrum)}
    className="px-4 py-2 bg-gray-700 rounded-lg hover:scale-105 transition"
  >
    {muteDrum ? "🔇 Drum OFF" : "🥁 Drum ON"}
  </button>

  <button
    onClick={() => setMuteWin(!muteWin)}
    className="px-4 py-2 bg-gray-700 rounded-lg hover:scale-105 transition"
  >
    {muteWin ? "🔇 Win OFF" : "🎉 Win ON"}
  </button>
</div>


      </div>
    </div>
  </div>
);
}
