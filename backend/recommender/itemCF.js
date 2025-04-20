import fs from 'fs';
import { getProductInfo } from '../loadMetadata.js';

// Read and parse dataset
const rawData = fs.readFileSync('data/cleaned_beauty.json', 'utf-8').split('\n');
const reviews = rawData
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line));


const productUserMap = {};

for (const { user_id, product_id, rating } of reviews) {
    if (rating >= 4) {   // Only consider liked
        if (!productUserMap[product_id]) {
            productUserMap[product_id] = new Set();
        }
        productUserMap[product_id].add(user_id);
    }
}

// Find similar products
function findSimilarProducts(targetProductId) {
    const targetUsers = productUserMap[targetProductId];
    if (!targetUsers) return [];

    const similarity = [];

    for (const [productId, users] of Object.entries(productUserMap)) {
        if (productId === targetProductId) continue;
        const overlap = [...users].filter(u => targetUsers.has(u));
        similarity.push({ productId, score: overlap.length });
    }

    return similarity.sort((a,b)=>b.score - a.score).map(p => p.productId);
}

// Final exported function
export async function itemBasedRecommend(productId) {
    const similar = findSimilarProducts(productId).slice(0, 10); // top-10
    return similar.map(id => {
        const info = getProductInfo(id);
        return `${info.title} by ${info.brand}`;
    });
}
