import { TrendsAPI } from "trendsapi-amazon";

const client = new TrendsAPI({ apiKey: process.env.TRENDSAPI_KEY });
const series = await client.getTimeSeries("standing desk");
console.log(series.at(-1));
