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
    caseType: {
        type: String,
        required: true,
    },
    caseDescription: {
        type: String,
        required: false,
    },
    caseStartDate: {
        type: Date,
        required: false,
    },
    caseEndDate: {
        type: Date,
        required: false,
    },
    caseHearingDate: {
        type: Date,
        required: false,
    },
    caseHearingTime: {
        type: String,
        required: false,
    },
    caseHearingVenue: {
        type: String,
        required: false,
    },
    caseJudge: {
        type: String,
        required: false,
    },
    caseCourt: {
        type: String,
        required: false,
    },
    caseDocuments: {
        type: Array,
        required: false,
    },

});

const Case = mongoose.model("Case", caseSchema);

export default Case;
