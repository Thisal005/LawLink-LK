import Case from "../models/case.model.js";


export const createCase = async (req, res) => {
    try {
        const { caseName, caseId, lawyerId, clientId, status } = req.body;
        const newCase = new Case({ caseName, caseId, lawyerId, clientId, status });
        await newCase.save();
        res.status(201).json(newCase);
    } catch (error) {
        console.error("Error in createCase controller:", error.message);
        res.status(500).json({ error: error.message });
    }
};