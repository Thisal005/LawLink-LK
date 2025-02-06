import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "uploads", "sri_lanka_legal_guide_extended.pdf");

if (fs.existsSync(filePath)) {
    console.log("✅ File exists! Now trying to read...");
    try {
        const data = fs.readFileSync(filePath);
        console.log("✅ File read successfully!");
    } catch (err) {
        console.error("❌ Error reading the file:", err);
    }
} else {
    console.error("❌ File does NOT exist at:", filePath);
}