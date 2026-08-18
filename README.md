# Amazon product-search demand API

JSON for **how often shoppers search a phrase** on Amazon. Not ASIN rank, not PA-API.

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/trendsapi-amazon.svg)](https://www.npmjs.com/package/trendsapi-amazon)

Key: [trendsapi.ai/#get-key](https://trendsapi.ai/#get-key). Full contract: [trendsapi-ai/trendsapi](https://github.com/trendsapi-ai/trendsapi).

## Install

```bash
npm install trendsapi-amazon
```

```ts
import { TrendsAPI } from "trendsapi-amazon";

const client = new TrendsAPI({ apiKey: process.env.TRENDSAPI_KEY });
const series = await client.getTimeSeries("standing desk");
const growth = await client.getGrowth("standing desk", { percent_growth: ["12M"] });
const bestsellers = await client.getLive({ limit: 10 });
```

Keyword helpers default to `source: "amazon"`. Override `source` for any other platform. Official full client: [`trendsapi`](https://www.npmjs.com/package/trendsapi).

## Call

| Field | Value |
|---|---|
| Endpoint | `POST https://api.trendsapi.ai/api` |
| Auth | `Authorization: Bearer $TRENDSAPI_KEY` |
| History | `source: amazon` with `get_time_series` or `get_growth` |
| Keyword | Product phrase, e.g. `standing desk` |
| Live `type` | `Amazon Best Sellers Top Rated`, `Amazon Best Sellers by Category` |

```bash
curl -sS -X POST https://api.trendsapi.ai/api \
  -H "Authorization: Bearer $TRENDSAPI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"mode":"get_time_series","source":"amazon","keyword":"standing desk"}'
```

`value` is a 0-100 search-interest index, not units sold. Points often use `datatype` rather than `source`.

Feeds answer "what is selling now." Keyword series answer "what is searched." `Amazon Best Sellers by Category` accepts `category`.

Google Shopping is a different `source` (`google shopping`), same phrase, second call.

Site: [trendsapi.ai/trends/amazon-trends](https://trendsapi.ai/trends/amazon-trends).

## License

MIT. See [LICENSE](LICENSE).
