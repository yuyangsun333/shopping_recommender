import express from 'express';
import cors from 'cors';
import { contentBasedRecommend, collaborativeFilteringRecommend } from './recommender/index.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Home
app.get('/', (req, res) => {
    res.send('Beauty Recommender API is running');
});

// Content-Based
app.get('/recommend/content', (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send({ error: 'Missing query' });

    const recommendations = contentBasedRecommend(query);
    res.send(recommendations);
});

// Collaborative Filtering
app.get('/recommend/collab', (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send({ error: 'Missing query' });

    const recommendations = collaborativeFilteringRecommend(query);
    res.send(recommendations);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
