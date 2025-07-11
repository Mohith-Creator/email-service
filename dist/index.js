"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const EmailService_1 = require("./services/EmailService");
const MockProviderA_1 = require("./providers/MockProviderA");
const MockProviderB_1 = require("./providers/MockProviderB");
const emailService = new EmailService_1.EmailService([
    new MockProviderA_1.MockProviderA(),
    new MockProviderB_1.MockProviderB(),
]);
(async () => {
    try {
        const result = await emailService.sendEmail({
            to: "test@example.com",
            subject: "Hello!",
            body: "This is a test email.",
            messageId: "unique-001", // Optional for idempotency
        });
        console.log("Email sent successfully:", result);
    }
    catch (error) {
        console.error("Email failed:", error);
    }
})();
