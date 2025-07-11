import { EmailProvider } from "../types";
import { delay } from "../utils/delay";
import { StatusTracker } from "../status/StatusTracker";
import { RateLimiter } from "../utils/RateLimiter";
import { IdempotencyStore } from "../utils/IdempotencyStore";

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  messageId?: string;
}

export class EmailService {
  private providers: EmailProvider[];
  private tracker = new StatusTracker();
  private limiter = new RateLimiter(5, 1000); // 5 requests per second
  private idempotency = new IdempotencyStore();

  constructor(providers: EmailProvider[]) {
    this.providers = providers;
  }

  public getStatus(messageId: string) {
    return this.tracker.getStatus(messageId);
  }
  async sendEmail(request: EmailRequest) {
    const id = request.messageId || `${request.to}-${Date.now()}`;

    if (this.idempotency.exists(id)) {
      console.log(`[Idempotency] Duplicate request: ${id}`);
      return { status: "duplicate", messageId: id };
    }

    if (!this.limiter.allow()) {
      console.log(`[RateLimiter] Rate limit exceeded`);
      throw new Error("Rate limit exceeded");
    }

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      let attempts = 0;

      console.log(`Trying provider: ${provider.name}`);

      while (attempts < 3) {
        console.log(`Attempt ${attempts + 1} using ${provider.name}`);
        try {
          await delay(2 ** attempts * 100); // exponential backoff
          await provider.send(request);

          this.idempotency.save(id);
          this.tracker.track(id, {
            provider: provider.name,
            status: "sent",
            attempts,
          });

          console.log(
            `Email sent via ${provider.name} (attempt ${attempts + 1})`
          );
          return { status: "sent", provider: provider.name, attempts };
        } catch (err: any) {
          console.log(
            `${provider.name} attempt ${attempts + 1} failed: ${err.message}`
          );
          attempts++;
        }
      }

      console.log(
        `${provider.name} failed after 3 attempts. Switching to next provider...`
      );
    }

    this.tracker.track(id, { provider: null, status: "failed", attempts: 3 });
    console.log(`All providers failed for message ID: ${id}`);
    throw new Error("All providers failed");
  }
}
