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
          content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided below between the symbol ### to set the style of your response.'
      },
      {
          role: 'user',
          content: `${data}
          ###
          OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
          ###

          ###
          Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
          ###
          `
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
