import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import { OpenAI } from "openai";

// Load environment variables
dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Store your API key in .env
});

// Serve static files (optional)
app.use(express.static("uploads"));

// Function to process PDF
const processPDF = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error("❌ PDF file not found at: " + filePath);
        }

        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text; // Extracted text from PDF
    } catch (error) {
        console.error("Error processing PDF:", error.message);
        throw new Error("Failed to process PDF: " + error.message);
    }
};

// Function to ask AI a question
const askAI = async (text, question) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4", // or "gpt-3.5-turbo"
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that answers questions based on the provided text.",
                },
                {
                    role: "user",
                    content: `Text: ${text}\n\nQuestion: ${question}`,
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error asking AI:", error.message);
        throw new Error("Failed to ask AI: " + error.message);
    }
};

// API Endpoint to read PDF and answer questions
app.get("/ask", async (req, res) => {
    try {
        const { question } = req.query; // Get question from query params
        if (!question) {
            return res.status(400).json({ success: false, error: "Question is required" });
        }

        const pdfPath = path.join(__dirname, "uploads", "sri_lanka_legal_guide_extended.pdf");
        const text = await processPDF(pdfPath);
        const answer = await askAI(text, question);

        res.json({ success: true, answer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send("✅ Server is running...");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});