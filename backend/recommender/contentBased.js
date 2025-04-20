import fs from 'fs';
import path from 'path';

const rows = fs
    .readFileSync(path.join('data', 'makeup_recommendation_dataset.csv'), 'utf-8')
    .split('\n')
    .slice(1)
    .filter(Boolean);

const products = rows.map(r => {
    const [
        user_id, skin_type, skin_color, preferred_price_range,
        product_id, product_name, target_skin_type, target_skin_color,
        price, rating, brand, review
    ] = r.split(',');
    return {
        product_id, product_name, brand,
        price: parseFloat(price),
        rating: parseFloat(rating),
        skin_type: target_skin_type,
        skin_color: target_skin_color,
        review
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
    const scored = products.map((p, idx) => ({
        idx,
        score: cosine(qVec, tfidfVector(`${p.product_name} ${p.review}`))
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, top).map(s => products[s.idx]);
}
