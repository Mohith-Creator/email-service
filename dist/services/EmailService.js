"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const delay_1 = require("../utils/delay");
const StatusTracker_1 = require("../status/StatusTracker");
const RateLimiter_1 = require("../utils/RateLimiter");
const IdempotencyStore_1 = require("../utils/IdempotencyStore");
class EmailService {
    constructor(providers) {
        this.tracker = new StatusTracker_1.StatusTracker();
        this.limiter = new RateLimiter_1.RateLimiter(5, 1000); // 5 requests per second
        this.idempotency = new IdempotencyStore_1.IdempotencyStore();
        this.providers = providers;
    }
    async sendEmail(request) {
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
                    await (0, delay_1.delay)(2 ** attempts * 100); // exponential backoff
                    await provider.send(request);
                    this.idempotency.save(id);
                    this.tracker.track(id, {
                        provider: provider.name,
                        status: "sent",
                        attempts,
                    });
                    return { status: "sent", provider: provider.name, attempts };
                }
                catch (err) {
                    attempts++;
                }
            }
        }
        this.tracker.track(id, { provider: null, status: "failed", attempts: 3 });
        throw new Error("All providers failed");
    }
}
exports.EmailService = EmailService;
