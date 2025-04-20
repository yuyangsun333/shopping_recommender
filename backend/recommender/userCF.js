import fs from 'fs';
import { getProductInfo } from '../loadMetadata.js';

// Read and parse dataset
const rawData = fs.readFileSync('data/cleaned_beauty.json', 'utf-8').split('\n');
const reviews = rawData
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line));

// Build user ➔ [products they liked]
const userProductMap = {};

for (const { user_id, product_id, rating } of reviews) {
    if (rating >= 4) {   // Only consider liked
        if (!userProductMap[user_id]) {
            userProductMap[user_id] = new Set();
        }
        userProductMap[user_id].add(product_id);
    }
}

// Find similar users
function findSimilarUsers(targetUserId) {
    const targetProducts = userProductMap[targetUserId];
    if (!targetProducts) return [];

    const similarity = [];

    for (const [userId, products] of Object.entries(userProductMap)) {
        if (userId === targetUserId) continue;
        const overlap = [...products].filter(p => targetProducts.has(p));
        similarity.push({ userId, score: overlap.length });
    }

    return similarity.sort((a,b)=>b.score - a.score).map(u => u.userId);
}

// Final exported function
export async function userBasedRecommend(userId) {
    const similarUsers = findSimilarUsers(userId).slice(0, 5); // top-5 similar users
    const recommended = new Set();

    for (const simUser of similarUsers) {
        for (const product of userProductMap[simUser] || []) {
            if (!userProductMap[userId]?.has(product)) {
                recommended.add(product);
            }
        }
    }

    // Top 10 products, mapped to title + brand
    return Array.from(recommended).slice(0, 10).map(id => {
        const info = getProductInfo(id);
        return `${info.title} by ${info.brand}`;
    });
}
