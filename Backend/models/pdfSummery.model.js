import mongoose from "mongoose";

const pdfSummerySchema = new mongoose.Schema({
    lawyerId: { type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer", 
    required: true },
    pdfFile: {
        filename: {type: String, required: true},
        originalname: {type: String, required: true},
        path: {type: String, required: true},
        mimetype: {type: String, required: true},
        size: {type: Number, required: true},
    },
    summary: {
        type: String,
        required: true,
    },
    audioFile: {
        filename: {type: String, required: true},
        path: {type: String, required: true},
        mimetype: {type: String, required: true},
        size: {type: Number, required: true},
    }
}, {timestamps: true});

export default mongoose.model("PdfSummery", pdfSummerySchema);