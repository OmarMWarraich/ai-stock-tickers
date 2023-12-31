import { dates } from "./utils/dates";
import OpenAI from "openai";

export async function fetchStockData(tickersArr) {
  try {
    const stockData = await Promise.all(
      tickersArr.map(async (ticker) => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.REACT_APP_POLYGON_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
          // Handle HTTP errors
          console.error(`HTTP error! Status: ${response.status}`);
          return null; // or throw an error if you prefer
        }

        const data = await response.text();
        return data;
      })
    );

    const report = await fetchReport(stockData.join(''));
    return report;
  } catch (err) {
    console.error('Error:', err);
    return null; // or throw an error if you prefer
  }
}

async function fetchReport(data) {
  const messages = [
      {
          role: 'system',
          content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell.'
      },
      {
          role: 'user',
          content: data
      }
  ]

  try {
      const openai = new OpenAI({
          apiKey: process.env.REACT_APP_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
      })
      const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: messages
      })
      return response.choices[0].message.content

  } catch (err) {
      console.log('Error:', err)
  }
}
