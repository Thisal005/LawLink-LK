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
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

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
          newContent += `\n\n--- Content from ${file} (TXT) ---\n${data}`;
        } else if (file.endsWith(".pdf")) {
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdfParse(dataBuffer);
          newContent += `\n\n--- Content from ${file} (PDF) ---\n${data.text}`;
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
    Your primary source for answering questions is this comprehensive knowledge base: ${cachedFileContent}.
    Use the knowledge base to craft detailed, accurate, and beautifully structured responses to legal and platform-related queries, such as Sri Lankan laws (e.g., Penal Code, Motor Traffic Act) or platform workflows.
    If the knowledge base lacks specific details, supplement with general Sri Lankan legal or platform context as a secondary measure:
    - <b>Client Workflow:</b> Log in, post up to 3 Pending cases (issue, district, case type), track statuses (Pending: gray, Ongoing: yellow-golden, Closed: red, Expired: dark gray), respond to lawyer interest with Yes/No, chat with lawyers when Ongoing, receive notifications (e.g., expiry after 14 days).
    - <b>Lawyer Workflow:</b> Sign up (admin verified), set district/case types (locked after first case), browse Pending cases and express interest, manage up to 3 Ongoing cases, add notes/tasks, close cases.
    Guidelines:
    - Prioritize the knowledge base for all answers, ensuring responses are rooted in its content.
    - Format responses professionally with bullet points ("•") for main points and indented sub-points ("◦") for details.
    - Use "<b>bold</b>" tags to highlight key terms or headings for elegance and clarity.
    - Echo the user’s question in a refined format at the start of the response (e.g., "<b>Your Query:</b> [question]").
    - Do not suggest clients can search for lawyers; lawyers browse and express interest in client-posted cases.
    - Provide actionable, precise advice for legal matters (e.g., accidents, disputes) based on the knowledge base.
    - Only use "I’m Lexi, focused on legal matters..." for questions clearly unrelated to legal issues or the platform (e.g., weather, sports).
    - Avoid unnecessary introductions; deliver polished, concise answers unless a greeting is requested.
  `;

  const lowerMessage = message.toLowerCase().trim();
  const originalMessage = message; // Preserve original casing for echoing

  // Minimal Predefined Responses
  if (["hi", "hello", "hey"].includes(lowerMessage)) {
    const greetings = [
      "<b>Welcome!</b> Greetings! I’m here to assist you with your legal needs in a professional manner.",
      "<b>Good Day!</b> Hello! I’m Lexi, your dedicated legal companion. How may I serve you?",
      "<b>Hello!</b> Hi! Welcome to your Sri Lankan legal assistant. I’m ready to help you elegantly and efficiently.",
    ];
    return res.status(200).json({ success: true, response: greetings[Math.floor(Math.random() * 3)] });
  }

  if (lowerMessage === "what can you do") {
    const response = `
      <b>Your Query:</b> What can you do?<br><br>
      <b>My Capabilities:</b><br>
      • Deliver detailed legal answers from an extensive knowledge base.<br>
      • Assist clients in posting up to 3 Pending cases and tracking their progress with finesse.<br>
      • Guide lawyers in browsing Pending cases and managing up to 3 Ongoing cases with precision.<br>
      • Provide beautifully structured explanations of platform workflows and Sri Lankan laws.<br>
      <b>Next Step:</b> How may I assist you today with elegance and expertise?
    `;
    return res.status(200).json({ success: true, response });
  }

  if (lowerMessage.includes("how do i find a lawyer")) {
    const response = `
      <b>Your Query:</b> How do I find a lawyer?<br><br>
      <b>Platform Process:</b><br>
      • This platform operates uniquely—clients don’t search for lawyers directly.<br>
      • <b>Step 1:</b> Post your case (up to 3 Pending cases) with details such as issue, district, and case type.<br>
      • <b>Step 2:</b> Lawyers browse Pending cases based on their predefined districts and case types.<br>
      • <b>Step 3:</b> If a lawyer expresses interest, you’ll receive a notification to accept (Yes) or decline (No).<br>
      • <b>Step 4:</b> Upon acceptance, your case becomes Ongoing, enabling seamless communication with the lawyer.<br>
      <b>Ready to Begin?</b> Shall I guide you through posting a case with professionalism?
    `;
    return res.status(200).json({ success: true, response });
  }

  // Gemini API Call
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: `${projectScope}\n\nUser question: ${message}\n\nAnswer directly using the knowledge base as the primary source. Format the response beautifully with bullet points and bold tags, echoing the user's question at the start.` },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    let reply = response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn’t find a specific answer in the knowledge base.";
    
    // Clean up scope leakage
    const scopeLines = projectScope.split("\n");
    reply = reply.split("\n")
      .filter(line => !scopeLines.some(scopeLine => scopeLine.trim() === line.trim()))
      .join("\n")
      .trim();

    // Ensure professional formatting
    reply = reply.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    if (!reply.includes("•") && reply.length > 50) {
      reply = `<b>Your Query:</b> ${originalMessage}<br><br><b>Response:</b><br>` + 
        reply.split(". ")
          .filter(line => line.trim())
          .map(line => `• ${line.trim()}.`)
          .join("<br>");
    } else if (!reply.includes("<b>Your Query:</b>")) {
      reply = `<b>Your Query:</b> ${originalMessage}<br><br><b>Response:</b><br>${reply}`;
    }

    // Fallback for unrelated questions
    const legalKeywords = ["law", "case", "platform", "legal", "lawyer", "client", "accident", "injury", "court", "claim", "police", "damage", "penal", "civil", "family", "labour"];
    if (!legalKeywords.some(keyword => lowerMessage.includes(keyword))) {
      reply = `
        <b>Your Query:</b> ${originalMessage}<br><br>
        <b>Response:</b><br>
        • I’m Lexi, dedicated to legal matters and this esteemed platform.<br>
        • Your question appears unrelated to legal issues or platform services.<br>
        • <b>How may I assist?</b> Please let me guide you with a case or legal query in a professional manner.
      `;
    }

    // Add a polished closing
    if (!reply.includes("How may I assist")) {
      reply += "<br><br><b>Next Step:</b> How may I further assist you with this matter?";
    }

    res.status(200).json({ success: true, response: reply });
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, msg: "Failed to process request" });
  }
};

const initChatbot = async (req, res) => {
  try {
    if (Date.now() - lastRefreshTime > REFRESH_INTERVAL) {
      await refreshFileContent();
    }
    const welcome = "<b>Welcome!</b> Hello! I’m Lexi, your professional assistant for Sri Lankan law and case management.";
    res.json({ success: true, welcome });
  } catch (error) {
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