import express from 'express';
import cors from 'cors';
import { userBasedRecommend } from './recommender/userCF.js';
import { itemBasedRecommend } from './recommender/itemCF.js';
import { loadMetadataFromUrl } from './loadMetadata.js';

// before starting API
await loadMetadataFromUrl('https://datarepo.eng.ucsd.edu/mcauley_group/data/amazon_2023/raw/meta_categories/meta_All_Beauty.jsonl.gz');
console.log('Metadata loaded. API starting...');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Beauty Recommender API');
});

// User-Based Recommendation
app.get('/recommend/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const recommendations = await userBasedRecommend(userId);
    res.json(recommendations);
});

// Item-Based Recommendation
app.get('/recommend/item/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    const recommendations = await itemBasedRecommend(itemId);
    res.json(recommendations);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
