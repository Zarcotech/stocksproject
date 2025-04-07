import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import yahooFinance from 'yahoo-finance2';
import rateLimit from 'express-rate-limit';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 8787;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/api', limiter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'index.html'));
});

app.get('/fetched/stock', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'stockinfo.html'));
});

app.get('/api/stock/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const data = await yahooFinance.quote(symbol);
        res.json({
            symbol: data.symbol,
            price: data.regularMarketPrice,
            change: data.regularMarketChangePercent?.toFixed(2) + '%' || 'N/A'
        });
    } catch (err) {
        res.status(404).json({ error: 'Stock not found or API error' });
    }
});

app.post('/fetchstock', async (req, res) => {
    const { symbol } = req.body;
    if (!symbol) return res.redirect('/?error=Symbol+required');
    res.redirect(`/fetched/stock?symbol=${encodeURIComponent(symbol)}`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});