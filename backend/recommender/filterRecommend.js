import fs from 'fs';
import path from 'path';

const rows = fs.readFileSync(
    path.join('data', 'makeup_recommendation_dataset.csv'), 'utf-8'
).split('\n').slice(1).filter(Boolean);

const products = rows.map(r => {
    const [
        user_id, skin_type, skin_color, preferred_price_range,
        product_id, product_name, target_skin_type, target_skin_color,
        price, rating, brand, review
    ] = r.split(',');

    return {
        product_id,
        product_name,
        brand: brand?.trim() || '',
        price: parseFloat(price),
        rating: parseFloat(rating),
        skin_type: target_skin_type?.trim().toLowerCase() || '',
        skin_color: target_skin_color?.trim().toLowerCase() || '',
        review: review?.trim() || ''
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
        const matchesSkin = !skinType || p.skin_type === skinType.toLowerCase();
        const matchesPrice = (priceMin === null || p.price >= priceMin) && (priceMax === null || p.price <= priceMax);
        const matchesRating = (minRating === null || p.rating >= minRating);
        const matchesBrand = !brand || p.brand.toLowerCase().includes(brand.toLowerCase());

        return matchesSkin && matchesPrice && matchesRating && matchesBrand;
    });

    cand.sort((a, b) => (b.rating - a.rating) || (a.price - b.price));
    return cand.slice(0, top);
}

