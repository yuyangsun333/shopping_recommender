import fs from 'fs';
import path from 'path';

const rows = fs.readFileSync(
    path.join('data', 'makeup_recommendation_dataset.csv'), 'utf-8'
).split('\n').slice(1).filter(Boolean);

const products = rows.map(r => {
    const [
        user_id, product_id, product_name,
        price, brand, rating, review
    ] = r.split(',');

    return {
        user_id,
        product_id,
        product_name,
        brand: brand?.trim() || '',
        price: parseFloat(price),
        rating: parseFloat(rating),
        review: review?.trim() || ''
    };
});

// TF-IDF preparation
const docFreq = {};
const docs = [];
products.forEach(p => {
    const text = `${p.product_name} ${p.review}`.toLowerCase();
    const words = new Set(text.match(/\b[a-z]+\b/g) || []);
    docs.push(words);
    words.forEach(w => { docFreq[w] = (docFreq[w] || 0) + 1; });
});
const N = products.length;

function tfidfVector(text) {
    const tokens = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const tf = {};
    tokens.forEach(t => tf[t] = (tf[t] || 0) + 1);
    const vec = {};
    Object.keys(tf).forEach(t => {
        if (!docFreq[t]) return;
        vec[t] = tf[t] * Math.log(N / docFreq[t]);
    });
    return vec;
}

function cosine(a, b) {
    let dot = 0, magA = 0, magB = 0;
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    keys.forEach(k => {
        const x = a[k] || 0;
        const y = b[k] || 0;
        dot += x * y;
        magA += x * x;
        magB += y * y;
    });
    return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

export function contentBasedRecommend(keyword, top = 5) {
    const qVec = tfidfVector(keyword);

    // Score all products
    const scored = products.map((p, idx) => ({
        idx,
        score: cosine(qVec, tfidfVector(`${p.product_name} ${p.review}`))
    }));

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);

    // Filter unique product_id
    const seen = new Set();
    const uniqueTop = [];

    for (const s of scored) {
        const prod = products[s.idx];
        if (!seen.has(prod.product_id)) {
            seen.add(prod.product_id);
            uniqueTop.push(prod);
        }
        if (uniqueTop.length >= top) break;
    }

    return uniqueTop;
}

