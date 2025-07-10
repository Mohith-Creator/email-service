// src/index.ts
import { EmailService } from "./services/EmailService";
import { MockProviderA } from "./providers/MockProviderA";
import { MockProviderB } from "./providers/MockProviderB";

const emailService = new EmailService([
  new MockProviderA(),
  new MockProviderB(),
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
  } catch (error) {
    console.error("Email failed:", error);
  }
})();
