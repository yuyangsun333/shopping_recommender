import fs from 'fs';

const rawData = fs.readFileSync('data/cleaned_beauty.json', 'utf-8').split('\n');

const reviews = rawData
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line));

// Build user ➔ [products they liked]
const userProductMap = {};

for (const review of reviews) {
    const { user_id, product_id, rating } = review;
    if (!userProductMap[user_id]) {
        userProductMap[user_id] = new Set();
    }
    if (rating >= 4) { // Only count if the user liked it (rating 4 or 5)
        userProductMap[user_id].add(product_id);
    }
}

// Function to find similar users
function findSimilarUsers(targetUserId) {
    const targetProducts = userProductMap[targetUserId];
    if (!targetProducts) return [];

    const similarity = [];

    for (const [userId, products] of Object.entries(userProductMap)) {
        if (userId === targetUserId) continue;
        const intersection = [...products].filter(x => targetProducts.has(x));
        similarity.push({ userId, commonCount: intersection.length });
    }

    similarity.sort((a, b) => b.commonCount - a.commonCount);

    return similarity.map(entry => entry.userId);
}

// Recommend products
export async function userBasedRecommend(userId) {
    const similarUsers = findSimilarUsers(userId).slice(0, 5); // Top 5 similar users
    const recommendedProducts = new Set();

    for (const simUserId of similarUsers) {
        for (const product of userProductMap[simUserId]) {
            if (!userProductMap[userId].has(product)) {
                recommendedProducts.add(product);
            }
        }
    }

    return Array.from(recommendedProducts).slice(0, 10); // Top 10 recommendations
}
