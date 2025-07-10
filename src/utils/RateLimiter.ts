export class RateLimiter {
  private limit: number;
  private interval: number;
  private queue: number[] = [];

  constructor(limit: number, interval: number) {
    this.limit = limit;
    this.interval = interval;
  }

  allow(): boolean {
    const now = Date.now();
    this.queue = this.queue.filter((ts) => now - ts < this.interval);
    if (this.queue.length < this.limit) {
      this.queue.push(now);
      return true;
    }
    return false;
  }
}
