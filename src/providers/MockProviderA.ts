import { EmailProvider } from "../types";

export class MockProviderA implements EmailProvider {
  name = "MockProviderA";

  async send({ to, subject, body }: any): Promise<void> {
    console.log(`[${this.name}] Sending to ${to}...`);
    if (Math.random() < 0.5) throw new Error("Provider A failed");
  }
}
