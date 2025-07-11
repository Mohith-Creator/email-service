"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProviderB = void 0;
class MockProviderB {
    constructor() {
        this.name = "MockProviderB";
    }
    async send({ to, subject, body }) {
        console.log(`[${this.name}] Sending to ${to}...`);
        if (Math.random() < 0.3) {
            throw new Error("Provider B failed");
        }
    }
}
exports.MockProviderB = MockProviderB;
