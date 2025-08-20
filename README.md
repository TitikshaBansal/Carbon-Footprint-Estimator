# Foodprint AI - Carbon Footprint Estimator (Backend)

TypeScript/Express backend that powers two endpoints for estimating a dish's carbon footprint using an LLM and a vision flow. Carbon values are mock/heuristic and do not require a database.

## Quickstart

Prereqs: Node 18+ (or Docker). Optionally set `GEMINI_API_KEY` to enable real LLM calls; without a key the service returns sensible mock ingredients so you can test end-to-end.

### Local (Node)
```bash
npm ci
npm run dev
# Server on http://localhost:8080
```

Set environment (optional):
```bash
$env:GEMINI_API_KEY="..."   # PowerShell on Windows
export GEMINI_API_KEY="..."  # bash/zsh
```

### Docker
```bash
docker compose up --build
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

Response mirrors `/estimate` and sets `source: "vision"`.

## Design Notes

- Strong typing via `src/types` and clear layering: routes → controllers → services.
- LLM/Vision use OpenAI SDK v4. If `OPENAI_API_KEY` is missing, both services return deterministic mocks to keep local dev frictionless.
- Carbon calculation uses a small lookup table with fallbacks; see `src/services/carbonEstimator.ts`.
- Memory-backed uploads via Multer with size/type constraints.

## Production Considerations

- Replace mock vision flow with a proper image understanding API and pass the actual image (URL or base64) to the provider.
- Observability: structured logging, request IDs, metrics, tracing.
- Security: input validation, rate limits, auth, secret management, dependency scanning.
- Performance: caching popular dish ingredient lists, batching LLM calls, timeout/retry strategy.
- API contract: publish OpenAPI/Swagger and add tests.
