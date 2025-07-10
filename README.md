# Resilient Email Sending Service

A backend service built in **TypeScript** that sends emails using multiple providers with features like:

* ✅ Retry with exponential backoff
* 🔄 Fallback between providers
* 🔁 Idempotency (prevents duplicate sends)
* 🚦 Rate limiting
* 📊 Status tracking
* 💣 Optional: Circuit breaker, logging, queuing

---

## 🚀 Features

### ✅ Retry Mechanism

Each provider is retried up to 3 times using exponential backoff (e.g., 100ms, 200ms, 400ms).

### 🔄 Fallback Providers

If the primary provider fails after retries, the service switches to the next one.

### 🔁 Idempotency

Requests with the same `messageId` will not send the same email multiple times.

### 🚦 Rate Limiting

Allows up to 5 emails per second using an in-memory token bucket system.

### 📊 Status Tracking

Each email send attempt is tracked with its status, retry count, and final provider.

---

## 📦 Tech Stack

* Language: **TypeScript**
* Runtime: **Node.js**
* Framework: **Express** (for REST API)

---

## 📂 Folder Structure

```
src/
├── index.ts                 # CLI entry point (optional)
├── server.ts                # Express API server
├── services/EmailService.ts
├── providers/MockProviderA.ts
├── providers/MockProviderB.ts
├── utils/
│   ├── RateLimiter.ts
│   ├── delay.ts
│   └── IdempotencyStore.ts
├── status/StatusTracker.ts
├── types/index.ts
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/email-service.git
cd email-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run start
```

### 4. Test API (using curl or Postman)

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test",
    "body": "Hello World",
    "messageId": "msg-123"
  }'
```

---

## 🧪 Running Tests (Optional)

If using Jest:

```bash
npm run test
```

## 📌 Assumptions

* Only two mock providers are used; in production, real email APIs like SendGrid or Mailgun would replace them.
* In-memory stores are used for rate limiting, idempotency, and tracking — suitable for demo but not production.

---

## 👤 Author

Developed by S. Mohith Reddy. Part of backend assignment for a Backend Developer Role.

---


Feel free to fork, clone, and expand this template!
