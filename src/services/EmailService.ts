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

  async sendEmail(request: EmailRequest) {
    const id = request.messageId || `${request.to}-${Date.now()}`;

    if (this.idempotency.exists(id)) {
      return { status: "duplicate", messageId: id };
    }

    if (!this.limiter.allow()) {
      throw new Error("Rate limit exceeded");
    }

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      let attempts = 0;

      while (attempts < 3) {
        try {
          await delay(2 ** attempts * 100); // exponential backoff
          await provider.send(request);
          this.idempotency.save(id);
          this.tracker.track(id, {
            provider: provider.name,
            status: "sent",
            attempts,
          });
          return { status: "sent", provider: provider.name, attempts };
        } catch (err) {
          attempts++;
        }
      }
    }

    this.tracker.track(id, { provider: null, status: "failed", attempts: 3 });
    throw new Error("All providers failed");
  }
}
