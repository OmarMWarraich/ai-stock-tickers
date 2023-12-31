import { dates } from "./utils/dates";

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
        console.log('Success', data);
        console.log(url);
        return data;
      })
    );

    return stockData.filter((data) => data !== null); // Filter out any null entries
  } catch (err) {
    console.error('Error:', err);
    return null; // or throw an error if you prefer
  }
}
