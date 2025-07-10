// src/server.ts
import express from "express";
import { EmailService } from "./services/EmailService";
import { MockProviderA } from "./providers/MockProviderA";
import { MockProviderB } from "./providers/MockProviderB";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const emailService = new EmailService([
  new MockProviderA(),
  new MockProviderB(),
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
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Failed to send email", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
