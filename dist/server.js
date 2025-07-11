"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const EmailService_1 = require("./services/EmailService");
const MockProviderA_1 = require("./providers/MockProviderA");
const MockProviderB_1 = require("./providers/MockProviderB");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
const emailService = new EmailService_1.EmailService([
    new MockProviderA_1.MockProviderA(),
    new MockProviderB_1.MockProviderB(),
]);
app.post("/send-email", async (req, res) => {
    const { to, subject, body, messageId } = req.body;
    if (!to || !subject || !body) {
        return res.status(400).json({ error: "Missing required fields." });
    }
    try {
        const result = await emailService.sendEmail({
            to,
            subject,
            body,
            messageId,
        });
        res.status(200).json(result);
    }
    catch (err) {
        res
            .status(500)
            .json({ error: "Failed to send email", details: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
