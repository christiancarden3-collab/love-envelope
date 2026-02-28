"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SECRET = "sugarpop"; // Maita's nickname as password

export default function WritePage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated this session
    if (sessionStorage.getItem("loveAuth") === "true") {
      setAuthenticated(true);
      fetchCurrentMessage();
    }
  }, []);

  const fetchCurrentMessage = async () => {
    try {
      const res = await fetch("/api/message");
      const data = await res.json();
      if (data.text) {
        setCurrentMessage(data.text);
        setMessage(data.text);
      }
    } catch (err) {
      console.error("Failed to fetch");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === SECRET) {
      setAuthenticated(true);
      sessionStorage.setItem("loveAuth", "true");
      fetchCurrentMessage();
    } else {
      alert("Wrong password 💔");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, secret: SECRET }),
      });
      if (res.ok) {
        setSaved(true);
        setCurrentMessage(message);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save 😢");
      }
    } catch (err) {
      alert("Error saving message");
    }
    setSaving(false);
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-white mb-6">✍️ Write Mode</h1>
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transition-colors"
          >
            Enter 💕
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          ✍️ Write Tomorrow's Letter
        </h1>
        <p className="text-pink-300 text-center mb-6 text-sm">
          This is what Maita will see when she opens her envelope tomorrow morning
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your love letter here... 💕"
            className="w-full h-64 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none font-serif text-lg"
          />

          <div className="flex items-center justify-between mt-4">
            <span className="text-white/50 text-sm">
              {message.length} characters
            </span>
            <button
              onClick={handleSave}
              disabled={saving || !message.trim()}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saving ? "Saving..." : saved ? "Saved! ✓" : "Save Letter 💌"}
            </button>
          </div>
        </div>

        {currentMessage && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/50 text-xs mb-2">Current saved message:</p>
            <p className="text-white/70 text-sm whitespace-pre-wrap line-clamp-3">
              {currentMessage.substring(0, 200)}...
            </p>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="mt-6 text-pink-300 hover:text-pink-200 text-sm mx-auto block"
        >
          ← Preview envelope
        </button>
      </div>
    </main>
  );
}
