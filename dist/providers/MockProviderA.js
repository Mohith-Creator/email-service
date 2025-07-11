"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProviderA = void 0;
class MockProviderA {
    constructor() {
        this.name = "MockProviderA";
    }
    async send({ to, subject, body }) {
        console.log(`[${this.name}] Sending to ${to}...`);
        if (Math.random() < 0.5)
            throw new Error("Provider A failed");
    }
}
exports.MockProviderA = MockProviderA;
