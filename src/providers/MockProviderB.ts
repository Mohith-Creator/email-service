// src/providers/MockProviderB.ts
import { EmailProvider } from "../types";

export class MockProviderB implements EmailProvider {
  name = "MockProviderB";

  async send({ to, subject, body }: any): Promise<void> {
    console.log(`[${this.name}] Sending to ${to}...`);
    if (Math.random() < 0.3) {
      throw new Error("Provider B failed");
    }
  }
}
