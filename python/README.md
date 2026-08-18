# Amazon product-search demand API

Amazon search interest and bestseller feeds via the Trends API. Ecommerce research without scrapers.

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PyPI](https://img.shields.io/pypi/v/trendsapi-amazon.svg)](https://pypi.org/project/trendsapi-amazon/)

Key: [trendsapi.ai/#get-key](https://trendsapi.ai/#get-key). Full contract: [trendsapi-ai/trendsapi](https://github.com/trendsapi-ai/trendsapi).

JS: [`trendsapi-amazon`](https://www.npmjs.com/package/trendsapi-amazon).

## Install

```bash
pip install trendsapi-amazon
```

```python
from trendsapi_amazon import TrendsAPI

client = TrendsAPI()  # TRENDSAPI_KEY
series = client.get_time_series("standing desk")
growth = client.get_growth("standing desk", percent_growth=["12M"])
hot = client.get_live(limit=10)
```

Keyword helpers default to `source: "amazon"`. Override `source=` for any other platform. Official full client: [`trendsapi`](https://pypi.org/project/trendsapi/).

## Call

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

`value` is a 0-100 search-interest index, not units sold.

Feeds answer what is selling now. Keyword series answer what is searched.

Google Shopping is a different `source` (`google shopping`).

Site: [https://trendsapi.ai/trends/amazon-trends](https://trendsapi.ai/trends/amazon-trends). GitHub: [trendsapi-ai/amazon-trends-api](https://github.com/trendsapi-ai/amazon-trends-api).

## License

MIT. See [LICENSE](LICENSE).
