import fs from 'fs';
import path from 'path';

function extractSkinType(review) {
    review = review.toLowerCase();
    if (review.includes('oily')) return 'oily';
    if (review.includes('dry')) return 'dry';
    if (review.includes('combination')) return 'combination';
    if (review.includes('normal')) return 'normal';
    if (review.includes('sensitive')) return 'sensitive';
    return '';
}

const rows = fs.readFileSync(
    path.join('data', 'makeup_recommendation_dataset.csv'), 'utf-8'
).split('\n').slice(1).filter(Boolean);

const products = rows.map(r => {
    const [
        user_id, product_id, product_name,
        price, brand, rating, review
    ] = r.split(',');

    const skin_type = extractSkinType(review || '');

    return {
        user_id,
        product_id,
        product_name,
        brand: brand?.trim() || '',
        price: parseFloat(price),
        rating: parseFloat(rating),
        review: review?.trim() || '',
        skin_type
    };
});

export function attributeFilterRecommend(options, top = 5) {
    const {
        skinType,
        priceMin,
        priceMax,
        minRating,
        brand
    } = options;

    const cand = products.filter(p => {
        return (!skinType || p.skin_type === skinType.toLowerCase())
            && (isNaN(priceMin) || p.price >= priceMin)
            && (isNaN(priceMax) || p.price <= priceMax)
            && (isNaN(minRating) || p.rating >= minRating)
            && (!brand || p.brand.toLowerCase().includes(brand.toLowerCase()));
    });

    // Prioritize by rating descending, price ascending
    cand.sort((a, b) => (b.rating - a.rating) || (a.price - b.price));

    // Avoid duplicate products by picking unique
    const seen = new Set();
    const result = [];
    for (const p of cand) {
        if (!seen.has(p.product_id)) {
            seen.add(p.product_id);
            result.push(p);
        }
        if (result.length >= top) break;
    }

    return result;
}

