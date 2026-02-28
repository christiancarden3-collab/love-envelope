import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "message.json");
const SECRET = "sugarpop";

function getMessage() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { text: "", date: "" };
  }
}

function saveMessage(text: string) {
  const data = {
    text,
    date: new Date().toISOString(),
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  return data;
}

export async function GET() {
  const message = getMessage();
  return NextResponse.json(message);
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

    const saved = saveMessage(text.trim());
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
