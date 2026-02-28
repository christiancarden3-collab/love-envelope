import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SECRET = "sugarpop";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  const supabase = getSupabase();
  
  if (!supabase) {
    // Fallback message when Supabase not configured
    return NextResponse.json({
      text: "Buenos días mi amor! 💕\n\nTe amo con todo mi corazón.\n\n- Tu Christian",
      date: new Date().toISOString(),
    });
  }

  try {
    const { data, error } = await supabase
      .from("love_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({
        text: "",
        date: "",
      });
    }

    return NextResponse.json({
      text: data.message,
      date: data.created_at,
    });
  } catch {
    return NextResponse.json({ text: "", date: "" });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, secret } = await request.json();

    if (secret !== SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("love_messages")
      .insert([{ message: text.trim() }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({
      text: data.message,
      date: data.created_at,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
