"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(limit, interval) {
        this.queue = [];
        this.limit = limit;
        this.interval = interval;
    }
    allow() {
        const now = Date.now();
        this.queue = this.queue.filter((ts) => now - ts < this.interval);
        if (this.queue.length < this.limit) {
            this.queue.push(now);
            return true;
        }
        return false;
    }
}
exports.RateLimiter = RateLimiter;
