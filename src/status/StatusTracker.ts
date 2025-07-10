interface Status {
  provider: string | null;
  status: string;
  attempts: number;
}

export class StatusTracker {
  private statuses: Record<string, Status> = {};

  track(id: string, status: Status) {
    this.statuses[id] = status;
  }

  getStatus(id: string) {
    return this.statuses[id];
  }
}
