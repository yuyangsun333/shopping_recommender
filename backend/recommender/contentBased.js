import fs from 'fs';
import path from 'path';

// Load data
const data = fs.readFileSync(path.join('data', 'final_recommendation_data.csv'), 'utf-8')
    .split('\n')
    .slice(1) // skip header
    .filter(line => line.trim() !== '');

// Parse correctly
const products = data.map(line => {
    const fields = line.split(',');
    return {
        productName: fields[5],
        skinType: fields[6],
        skinColor: fields[7],
        price: parseFloat(fields[8]),
        rating: parseFloat(fields[9]),
        brand: fields[10]
    };
});

// Text vectorization
function vectorize(text) {
    const words = text.toLowerCase().split(/\s+/);
    const counts = {};
    for (const word of words) {
        counts[word] = (counts[word] || 0) + 1;
    }
    return counts;
}

// Cosine similarity
function cosineSim(vecA, vecB) {
    let dot = 0, magA = 0, magB = 0;
    const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    for (const key of keys) {
        const a = vecA[key] || 0;
        const b = vecB[key] || 0;
        dot += a * b;
        magA += a * a;
        magB += b * b;
    }
    if (magA === 0 || magB === 0) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// Content-based recommendation
export function contentBasedRecommend(query) {
    const queryVec = vectorize(query);
    const scored = products.map(p => ({
        productName: p.productName,
        score: cosineSim(queryVec, vectorize(p.productName))
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 5).map(p => p.productName);
}
