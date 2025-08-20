# Foodprint AI - Carbon Footprint Estimator (Backend)

TypeScript/Express backend that powers two endpoints for estimating a dish's carbon footprint using an LLM and a vision flow. Carbon values are mock/heuristic and do not require a database.

## How to run (locally)

Prereqs: Node 18+. Setting `GEMINI_API_KEY` is optional; without it the app uses deterministic mocks so you can test end‑to‑end.

1) Install deps
```bash
npm install
```

2) Create a `.env` file (optional)
```env
GEMINI_API_KEY=YOUR_GEMINI_KEY
PORT=8080
```

3) Start the server
```bash
npm run dev
# Server runs at http://localhost:8080
```

4) Health check
```bash
curl http://localhost:8080/
```

## API

### POST `/estimate`
Infer ingredients from a dish name and estimate carbon.

Request:
```json
{ "dish": "Chicken Biryani" }
```

Response (example):
```json
{
  "dish": "Chicken Biryani",
  "estimated_carbon_kg": 4.2,
  "ingredients": [
    { "name": "Rice", "carbon_kg": 1.1 },
    { "name": "Chicken", "carbon_kg": 2.5 },
    { "name": "Spices", "carbon_kg": 0.2 },
    { "name": "Oil", "carbon_kg": 0.4 }
  ],
  "source": "llm"
}
```

### POST `/estimate/image`
Accepts `multipart/form-data` with field name `image`.
In Postman you can also use key `file`.

Response mirrors `/estimate` and sets `source: "vision"`.

Example curl:
```bash
curl -X POST http://localhost:8080/estimate/image \
  -F "image=@C:/path/to/your/image.jpg;type=image/jpeg"
```

### Testing with Postman
- Base URL: `http://localhost:8080`
- Dish endpoint: POST `/estimate` with body as JSON `{ "dish": "Chicken Biryani" }` or x-www-form-urlencoded `dish=Chicken Biryani`
- Image endpoint: POST `/estimate/image` with form-data key `image` (or `file`) and a JPG/PNG file
- Common 400s: `dish string required` (missing/empty), `image file required` (no file uploaded)

## Assumptions and limitations

- Ingredients are inferred by an LLM; there is no authoritative dataset.
- Carbon factors are heuristic and intentionally coarse; a small lookup map plus a generic fallback is used.
- Quantities/portion sizes are not predicted; each ingredient contributes a typical average value.
- Vision flow identifies likely ingredients, not precise detection; uploads limited to 5 MB and JPG/PNG.
- If `GEMINI_API_KEY` is absent, services return deterministic mock ingredients for local testing.

## Design decisions

- Strong typing via `src/types` and clear layering: routes → controllers → services.
- LLM and Vision use Google's Gemini via `@google/generative-ai`. If `GEMINI_API_KEY` is missing, both services return deterministic mocks to keep local dev frictionless.
- Carbon calculation uses a small lookup table with fallbacks; see `src/services/carbonEstimator.ts`.
- Memory-backed uploads via Multer with size/type constraints.
- Input normalization and filtering remove junk tokens (e.g., empty strings, "json").
- Simple CORS enabled to ease manual testing tools.

## Production Considerations

- Replace mock vision flow with a proper image understanding API and pass the actual image (URL or base64) to the provider.
- Observability: structured logging, request IDs, metrics, tracing.
- Security: input validation, rate limits, auth, secret management, dependency scanning.
- Performance: caching popular dish ingredient lists, batching LLM calls, timeout/retry strategy.
- API contract: publish OpenAPI/Swagger and add tests.
 - Reliability: retries with backoff for AI calls, circuit breakers, and budget limits on external usage.
