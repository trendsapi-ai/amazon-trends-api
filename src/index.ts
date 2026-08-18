import {
  TrendsAPI as Core,
  TrendsAPIError,
  type TrendsAPIOptions,
  type TrendsDataPoint,
  type GetGrowthResponse,
  type GetTopTrendsParams,
  type GetTopTrendsResponse,
  type GrowthPreset,
  type CustomGrowthPeriod,
  type TrendsSource,
} from "trendsapi";

export { TrendsAPIError };
export type {
  TrendsAPIOptions,
  TrendsDataPoint,
  GetGrowthResponse,
  GetTopTrendsParams,
  GetTopTrendsResponse,
  GrowthPreset,
  CustomGrowthPeriod,
  TrendsSource,
};

/** Default source for this package. Override with `source` anytime. */
export const DEFAULT_SOURCE = "amazon" as const;
export const DEFAULT_FEED = "Amazon Best Sellers Top Rated" as const;
export const VERSION = "1.0.1";

type SeriesOpts = { source?: TrendsSource; data_mode?: string };
type GrowthOpts = {
  source?: TrendsSource;
  percent_growth?: Array<GrowthPreset | CustomGrowthPeriod>;
  data_mode?: string;
};

/**
 * Amazon trends API — search interest + best seller feeds
 *
 * Keyword-first helpers default to `amazon`.
 * One API key still unlocks every other source — pass `source` to override.
 */
export class TrendsAPI {
  /** Underlying full client (any source / any mode). */
  readonly core: Core;

  constructor(opts: TrendsAPIOptions = {}) {
    this.core = new Core(opts);
  }

  /** Keyword-first time series (defaults to `amazon`). */
  getTimeSeries(
    keyword: string,
    opts: SeriesOpts = {},
  ): Promise<TrendsDataPoint[]> {
    return this.core.getTimeSeries({
      source: opts.source ?? DEFAULT_SOURCE,
      keyword,
      data_mode: opts.data_mode,
    });
  }

  /** Alias for getTimeSeries. */
  getTrends(keyword: string, opts: SeriesOpts = {}): Promise<TrendsDataPoint[]> {
    return this.getTimeSeries(keyword, opts);
  }

  /** Keyword-first growth (defaults to `amazon`). */
  getGrowth(keyword: string, opts: GrowthOpts = {}): Promise<GetGrowthResponse> {
    return this.core.getGrowth({
      source: opts.source ?? DEFAULT_SOURCE,
      keyword,
      percent_growth: opts.percent_growth,
      data_mode: opts.data_mode,
    });
  }

  getTopTrends(params: GetTopTrendsParams = {}): Promise<GetTopTrendsResponse> {
    return this.core.getTopTrends(params);
  }

  /** Live feed helper preset to `Amazon Best Sellers Top Rated`. */
  getLive(params: { limit?: number; offset?: number; category?: string } = {}) {
    return this.core.getTopTrends({ type: DEFAULT_FEED, ...params });
  }
}

export default TrendsAPI;
