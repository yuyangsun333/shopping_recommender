import express from 'express';
import cors from 'cors';
import { contentBasedRecommend, attributeFilterRecommend } from './recommender/index.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/recommend/content', (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing query' });
    res.json(contentBasedRecommend(q));
});

app.post('/recommend/filter', (req, res) => {
    const opts = {
        skinType: req.body.skinType || null,
        priceMin: req.body.priceMin ? Number(req.body.priceMin) : null,
        priceMax: req.body.priceMax ? Number(req.body.priceMax) : null,
        minRating: req.body.minRating ? Number(req.body.minRating) : null,
        brand: req.body.brand || null
    };
    res.json(attributeFilterRecommend(opts));
});

app.listen(PORT, () => console.log(`✅ API running at http://localhost:${PORT}`));
