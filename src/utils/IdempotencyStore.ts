export class IdempotencyStore {
  private storeSet = new Set<string>();

  exists(id: string): boolean {
    return this.storeSet.has(id);
  }

  save(id: string): void {
    this.storeSet.add(id);
  }
}
