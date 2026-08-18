# Amazon product-search demand API

Amazon search interest and bestseller feeds via the Trends API. Ecommerce research without scrapers.

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PyPI](https://img.shields.io/pypi/v/trendsapi-amazon.svg)](https://pypi.org/project/trendsapi-amazon/)
[![Python](https://img.shields.io/badge/python-3.9%2B-yellow.svg)](https://trendsapi.ai)

Key: [trendsapi.ai/#get-key](https://trendsapi.ai/#get-key). HTTP contract: [trendsapi-ai/trendsapi](https://github.com/trendsapi-ai/trendsapi).

JS: [`trendsapi-amazon`](https://www.npmjs.com/package/trendsapi-amazon).

## Authentication

```bash
pip install trendsapi-amazon
export TRENDSAPI_KEY=your_key
```

Python 3.9+. The wrapper re-exports `TrendsAPI`, `AsyncTrendsAPI`, and `TrendsAPIError` from the official client.

```python
from trendsapi_amazon import TrendsAPI

client = TrendsAPI()                    # TRENDSAPI_KEY
# client = TrendsAPI(api_key="YOUR_KEY")
```

Keyword helpers default to `source: "amazon"`. Pass `source=` to hit any other platform with the same client. Official full client (every source, no preset): [`trendsapi`](https://pypi.org/project/trendsapi/).

## Methods

| Method | REST `mode` | Returns |
|---|---|---|
| `get_time_series(keyword, source=, data_mode=)` | `get_time_series` | `list[TrendsDataPoint]` |
| `get_growth(keyword, percent_growth=, source=, data_mode=)` | `get_growth` | `GetGrowthResponse` |
| `get_live(limit=, offset=, category=)` | `get_top_trends` | `GetTopTrendsResponse` |
| `get_top_trends(type=, ...)` | `get_top_trends` | `GetTopTrendsResponse` |

`source` is lowercase (`amazon`). `type` is exact (`Amazon Best Sellers Top Rated`). Mixing them is a 400.

```python
from trendsapi_amazon import TrendsAPI

client = TrendsAPI()                    # TRENDSAPI_KEY
# client = TrendsAPI(api_key="YOUR_KEY")

series = client.get_time_series("standing desk")
print(series[-1].date, series[-1].value)

growth = client.get_growth("standing desk", percent_growth=["3M", "12M"])
print(growth.results[0].growth, growth.results[0].direction)

hot = client.get_live(limit=10)
print(hot.data)                         # [[1, "..."], ...]
```

## get_time_series

```python
points = client.get_time_series("standing desk")
```

Each point:

| Field | Always | Meaning |
|---|---|---|
| `date` | yes | `YYYY-MM-DD` |
| `value` | yes | 0-100 index for this series |
| `keyword` | yes | Echo |
| `volume` | no | Absolute volume when available |
| `source` or `datatype` | no | Pipeline label |

Python returns `list[TrendsDataPoint]`. Use `.date` and `.value`, not `["date"]`.
JS returns the same fields as object properties.

## get_growth

```python
g = client.get_growth("standing desk", percent_growth=["12M", "3M", "YTD"])
print(g.results[0].growth, g.results[0].direction)
```

`percent_growth` default: `["12M"]`. Presets: `7D` `14D` `30D` `1M` `2M` `3M` `6M` `9M` `12M`/`1Y` `18M` `24M`/`2Y` `36M`/`3Y` `48M` `60M`/`5Y` `MTD` `QTD` `YTD`. Custom: `{"name": "Launch", "recent": "2024-06-01", "baseline": "2024-01-01"}`.

| Field | Meaning |
|---|---|
| `search_term` | Keyword |
| `data_source` | Source |
| `results` | One object per window (`period`, `growth`, `direction`, dates, values) |
| `metadata` | Counts / success flag |

Several windows still count as one request. Python: `growth.results[0].growth`. JS: `growth.results[0].growth`.


## get_live

```python
hot = client.get_live(limit=10)
```

| Field | Meaning |
|---|---|
| `as_of_ts` | Snapshot time |
| `type` | Feed name |
| `limit`, `offset`, `count` | Pagination |
| `data` | `[rank, label]` rows |

Python: `hot.data`. JS: `hot.data`. Optional `offset=` and `category=` (`Amazon Best Sellers by Category`, `Top Websites` only).


## Async

```python
import asyncio
from trendsapi_amazon import AsyncTrendsAPI

async def main():
    c = AsyncTrendsAPI()
    return await asyncio.gather(
        c.get_time_series("standing desk"),
        c.get_time_series("standing desk", source="google search"),
    )

asyncio.run(main())
```

Each 200 is one billed request.

## Pandas

```python
from dataclasses import asdict
import pandas as pd
from trendsapi_amazon import TrendsAPI

df = pd.DataFrame(asdict(p) for p in TrendsAPI().get_time_series("standing desk"))
df["date"] = pd.to_datetime(df["date"])
print(df.set_index("date")["value"].resample("ME").mean().tail())
```

## Call (curl)

| Field | Value |
|---|---|
| Endpoint | `POST https://api.trendsapi.ai/api` |
| Auth | `Authorization: Bearer $TRENDSAPI_KEY` |
| History | `source: amazon` with `get_time_series` or `get_growth` |
| Keyword | Product phrase, e.g. standing desk |
| Live `type` | Amazon Best Sellers Top Rated, Amazon Best Sellers by Category |

```bash
curl -sS -X POST https://api.trendsapi.ai/api \
  -H "Authorization: Bearer $TRENDSAPI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"mode":"get_time_series","source":"amazon","keyword":"standing desk"}'
```

## Source notes

- `value` is a 0-100 search-interest index, not units sold.
- Feeds answer what is selling now. Keyword series answer what is searched.
- Google Shopping is a different `source` (`google shopping`).

## Errors

| HTTP | Client |
|---|---|
| 200 | Parsed payload. Python dataclasses / JS typed objects |
| 400 | Raises. Fix `source` or `type` spelling |
| 401 | Raises. Check `TRENDSAPI_KEY` |
| 404 | Raises. No series for that keyword. Do not retry |
| 429 | Raises. Quota |
| 5xx | Client retries, then raises |

The HTTP `body` field is a JSON string. SDKs decode it. Raw curl must parse `body` a second time.

Site: [https://trendsapi.ai/trends/amazon-trends](https://trendsapi.ai/trends/amazon-trends). GitHub: [trendsapi-ai/amazon-trends-api](https://github.com/trendsapi-ai/amazon-trends-api).

## License

MIT. See [LICENSE](LICENSE).
