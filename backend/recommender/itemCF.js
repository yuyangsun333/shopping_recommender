import fs from 'fs';

// Load and parse the dataset once when server starts
const rawData = fs.readFileSync('data/cleaned_beauty.json');
const reviews = JSON.parse(rawData);

// Build product ➔ [users who liked it]
const productUserMap = {};

for (const review of reviews) {
    const { user_id, product_id, rating } = review;
    if (!productUserMap[product_id]) {
        productUserMap[product_id] = new Set();
    }
    if (rating >= 4) { // Only count if liked
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
        const intersection = [...users].filter(x => targetUsers.has(x));
        similarity.push({ productId, commonCount: intersection.length });
    }

    similarity.sort((a, b) => b.commonCount - a.commonCount);

    return similarity.map(entry => entry.productId);
}

// Recommend similar products
export async function itemBasedRecommend(productId) {
    const similarProducts = findSimilarProducts(productId).slice(0, 10); // Top 10 similar
    return similarProducts;
}
