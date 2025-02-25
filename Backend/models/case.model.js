import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
    caseName: {
        type: String,
        required: true,
    },
    caseId: {
        type: String,
        required: true,
        unique: true,
    },
    lawyerId: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
});

const Case = mongoose.model("Case", caseSchema);

export default Case;
