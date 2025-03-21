// Backend/controllers/chatbot.controller.js
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedFileContent = "";
let lastRefreshTime = 0;
const REFRESH_INTERVAL = 10 * 60 * 1000;

const refreshFileContent = async () => {
  const fileDir = path.join(__dirname, "../ChatbotFiles");
  console.log("📂 File Directory:", fileDir);
  let newContent = "";
  try {
    if (!fs.existsSync(fileDir)) {
      console.log("ChatbotFiles directory not found, creating it...");
      fs.mkdirSync(fileDir, { recursive: true });
    }
    const files = fs.readdirSync(fileDir).filter((file) => file.endsWith(".pdf") || file.endsWith(".txt"));
    console.log("📜 Files Found:", files);
    if (files.length === 0) {
      newContent = "Default content: This is a Sri Lankan legal case management platform.";
    } else {
      for (const file of files) {
        const filePath = path.join(fileDir, file);
        console.log("Reading file:", filePath);
        if (file.endsWith(".txt")) {
          const data = fs.readFileSync(filePath, "utf8");
          newContent += `\n\n--- Content from ${file} (TXT) ---\n${data.slice(0, 10000)}`;
        } else if (file.endsWith(".pdf")) {
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdfParse(dataBuffer);
          newContent += `\n\n--- Content from ${file} (PDF) ---\n${data.text.slice(0, 10000)}`;
        }
      }
    }
  } catch (error) {
    console.error("Error reading files:", error.message);
    newContent = "Default content: This is a Sri Lankan legal case management platform.";
  }
  cachedFileContent = newContent;
  lastRefreshTime = Date.now();
  console.log("✅ File content refreshed. Length:", cachedFileContent.length);
};

// Initial load
refreshFileContent();

const chatWithLegalBot = async (req, res) => {
  const { message } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ success: false, msg: "Gemini API key not configured" });
  }

  if (!message) {
    return res.status(400).json({ success: false, msg: "Message is required" });
  }

  if (Date.now() - lastRefreshTime > REFRESH_INTERVAL) {
    await refreshFileContent();
  }

  const projectScope = `
    You are Lexi, a professional legal assistant for a Sri Lankan law case management platform.
    Use this knowledge base to answer questions: ${cachedFileContent}.
    Base answers on the platform's workflow:
    - <b>Client Workflow:</b> Log in, manage cases (Pending, Ongoing, Closed, Expired), post up to 3 Pending cases, get notifications (e.g., lawyer interest, case updates), use Chatbot anytime, Chat when Ongoing. Cases expire after 14 days if untaken; reviews trigger after 10 days of inactivity.
    - <b>Lawyer Workflow:</b> Sign up (unverified until admin approves), set district/case types (locked after first case), manage up to 3 Ongoing cases, express interest in Pending cases, add notes/tasks, close cases, use Chatbot/Chat when Ongoing.
    For greetings like "Hi" or "Hello," choose one:
    - "Good day! How may I assist you with your legal matters today?"
    - "Hello! I’m Lexi, your legal assistant. How can I support you?"
    - "Welcome! How can I help you navigate your legal needs?"
    For "What can you do?", respond with:
    - "I’m Lexi, your go-to assistant! Here’s what the platform offers:\n  • <b>Clients:</b> Post up to 3 Pending cases with details like issue, district, and case type; track statuses (Pending in gray, Ongoing in yellow-golden, Closed in red, Expired in dark gray); agree to lawyer interest with Yes/No; chat with lawyers when Ongoing; receive notifications for case updates, lawyer interest, or expiry after 14 days.\n  • <b>Lawyers:</b> Sign up with name, email, contact, and ID upload; manage up to 3 Ongoing cases after admin verification; express interest in Pending cases; add notes (e.g., 'Called client') and tasks (e.g., 'Submit evidence'); close cases when done.\nAs your chatbot, I can:\n  • Explain all platform features in detail.\n  • Guide you step-by-step through posting or managing cases.\n  • Provide detailed info on Sri Lankan laws—criminal, family, civil, or labour.\n  • Answer workflow questions with precision.\nWhat do you want to explore?"
    For unrelated questions, say: "I’m here to assist with legal matters only. How can I help with your case or query?"
    Include Sri Lankan legal context where relevant:
    - <b>Criminal Law:</b> Penal Code (e.g., murder - Section 296, death or life imprisonment; theft - Section 366, up to 7 years); filed via police or private plaint in Magistrate’s Court; trials in High Court for serious cases.
    - <b>Family Law:</b> Marriage Registration Ordinance (general law registration); divorce via Civil Procedure Code, Section 597 (grounds: adultery, cruelty); custody under Kandyan/Muslim laws or District Court welfare focus.
    - <b>Civil Law:</b> Contracts under Roman-Dutch law; property via Land Registration Ordinance; torts for damages.
    - <b>Labour Law:</b> Shop and Office Employees Act (wages, hours); Workmen’s Compensation Ordinance (workplace injuries).
    Provide detailed, aligned answers with bullet points starting with "•" and indented sub-points with "  •" for clarity.
    Use "<b>bold</b>" tags for emphasis (no Markdown).
    Keep responses professional, detailed, and well-structured.
  `;

  const lowerMessage = message.toLowerCase().trim();
  if (lowerMessage === "hi" || lowerMessage === "hello") {
    const greetings = [
      "Good day! How may I assist you with your legal matters today?",
      "Hello! I’m Lexi, your legal assistant. How can I support you?",
      "Welcome! How can I help you navigate your legal needs?",
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    return res.status(200).json({ success: true, response: randomGreeting });
  }
  if (lowerMessage.includes("what can you do")) {
    const response = `
      I’m Lexi, your go-to assistant! Here’s what the platform offers:
        • <b>Clients:</b> Post up to 3 Pending cases with details like issue, district, and case type; track statuses (Pending in gray, Ongoing in yellow-golden, Closed in red, Expired in dark gray); agree to lawyer interest with Yes/No; chat with lawyers when Ongoing; receive notifications for case updates, lawyer interest, or expiry after 14 days.
        • <b>Lawyers:</b> Sign up with name, email, contact, and ID upload; manage up to 3 Ongoing cases after admin verification; express interest in Pending cases; add notes (e.g., 'Called client') and tasks (e.g., 'Submit evidence'); close cases when done.
      As your chatbot, I can:
        • Explain all platform features in detail.
        • Guide you step-by-step through posting or managing cases.
        • Provide detailed info on Sri Lankan laws—criminal, family, civil, or labour.
        • Answer workflow questions with precision.
      What do you want to explore?
    `;
    return res.status(200).json({ success: true, response });
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: `${projectScope}\n\nUser question: ${message}` },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    let reply = response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn’t find an answer.";
    reply = reply.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    if (!reply.includes("•") && reply.length > 50 && !reply.includes("I’m here to assist")) {
      reply = reply
        .split(". ")
        .filter((line) => line.trim())
        .map((line) => `• ${line.trim()}.`)
        .join("\n");
    }
    res.status(200).json({ success: true, response: reply });
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, msg: "Failed to process request with Gemini" });
  }
};

const initChatbot = async (req, res) => {
  try {
    if (Date.now() - lastRefreshTime > REFRESH_INTERVAL) {
      await refreshFileContent();
    }
    const welcomeOptions = [
      "Good day! How may I assist you with your legal matters today?",
      "Hello! I’m Lexi, your legal assistant. How can I support you?",
      "Welcome! How can I help you navigate your legal needs?",
    ];
    const welcome = welcomeOptions[Math.floor(Math.random() * welcomeOptions.length)];
    res.json({ success: true, welcome });
  } catch (error) {
    console.error("Init Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to initialize Lexi" });
  }
};

const uploadChatbotFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, msg: "No file uploaded" });
  }
  refreshFileContent();
  res.status(200).json({ success: true, msg: "File uploaded successfully" });
};

export { chatWithLegalBot, uploadChatbotFile, initChatbot };