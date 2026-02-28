"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState<{ text: string; date: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyOpened, setAlreadyOpened] = useState(false);

  useEffect(() => {
    // Check if already opened today
    const today = new Date().toISOString().split("T")[0];
    const lastOpened = localStorage.getItem("lastOpened");
    if (lastOpened === today) {
      setAlreadyOpened(true);
      // Still fetch the message to show it
      fetchMessage();
    }
    setLoading(false);
  }, []);

  const fetchMessage = async () => {
    try {
      const res = await fetch("/api/message");
      const data = await res.json();
      if (data.text) {
        setMessage(data);
      }
    } catch (err) {
      console.error("Failed to fetch message");
    }
  };

  const handleOpen = async () => {
    setOpened(true);
    await fetchMessage();
    // Mark as opened today
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("lastOpened", today);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 flex items-center justify-center">
        <div className="animate-pulse text-rose-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-rose-600 mb-2 text-center">
        Buenos Días, Mi Amor 💕
      </h1>
      <p className="text-rose-400 mb-8 text-center">
        {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>

      {/* Envelope */}
      {!opened && !alreadyOpened ? (
        <div className="relative cursor-pointer group" onClick={handleOpen}>
          {/* Envelope body */}
          <div className="w-72 h-48 md:w-96 md:h-64 bg-gradient-to-br from-rose-200 to-pink-200 rounded-lg shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-rose-300/50 relative overflow-hidden">
            {/* Envelope flap */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-rose-300 to-pink-300 origin-top transform transition-transform duration-500 group-hover:-rotate-x-12" 
                 style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }} />
            
            {/* Heart seal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-6xl animate-pulse">
              💌
            </div>
          </div>
          
          {/* Click hint */}
          <p className="text-center mt-6 text-rose-500 font-medium animate-bounce">
            Toca para abrir ✨
          </p>
        </div>
      ) : (
        /* Letter content */
        <div className="w-full max-w-lg animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10 border border-rose-100">
            {message ? (
              <>
                <div className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                  {message.text}
                </div>
                <div className="mt-8 pt-6 border-t border-rose-100 text-right">
                  <p className="text-rose-400 text-sm">Con todo mi amor,</p>
                  <p className="text-rose-600 font-bold text-lg mt-1">Tu Christian 💕</p>
                </div>
              </>
            ) : (
              <div className="text-center text-rose-400 py-8">
                <p className="text-4xl mb-4">💔</p>
                <p>No hay mensaje para hoy todavía...</p>
                <p className="text-sm mt-2">Pero te amo igual! ❤️</p>
              </div>
            )}
          </div>
          
          {alreadyOpened && (
            <p className="text-center mt-4 text-rose-400 text-sm">
              Ya abriste tu carta de hoy 💕
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="absolute bottom-4 text-rose-300 text-xs">
        Hecho con ❤️ para ti
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
