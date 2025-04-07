import express from 'express'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import yahooFinance from 'yahoo-finance2';

const price = await getPrice('AAPL');
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 8787;

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'templates', 'index.html'));
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}) 

app.use(express.static(path.join(__dirname, '..', 'public')));

async function getPrice(symbol) {
    return (await yahooFinance.quote(symbol)).regularMarketPrice;
}

app.get('/api/stock/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      const data = await yahooFinance.quote(symbol);
      res.json({
          price: data.regularMarketPrice,
          change: data.regularMarketChangePercent.toFixed(2) + '%'
      });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

app.get('/fetchstock', (req, res) => {
  res.redirect('/fetched/stock');
})

app.get('/fetched/stock', (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'templates', 'stockinfo.html'));
})

app.get('/api/request/:symbol', async (req, res) => {
  try {
      const { symbol } = req.params;
      
      const quote = await yahooFinance.quote(symbol);
      
      res.json({
          symbol: quote.symbol,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChangePercent.toFixed(2) + "%"
      });
      
  } catch (error) {
      res.status(500).json({ 
          error: "Couldn't fetch stock data",
          details: error.message 
      });
  }
});
