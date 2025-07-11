"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTracker = void 0;
class StatusTracker {
    constructor() {
        this.statuses = {};
    }
    track(id, status) {
        this.statuses[id] = status;
    }
    getStatus(id) {
        return this.statuses[id];
    }
}
exports.StatusTracker = StatusTracker;
