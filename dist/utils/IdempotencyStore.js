"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyStore = void 0;
class IdempotencyStore {
    constructor() {
        this.storeSet = new Set();
    }
    exists(id) {
        return this.storeSet.has(id);
    }
    save(id) {
        this.storeSet.add(id);
    }
}
exports.IdempotencyStore = IdempotencyStore;
