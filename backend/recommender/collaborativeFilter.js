import fs from 'fs';
import path from 'path';

// Load data
const data = fs.readFileSync(path.join('data', 'final_recommendation_data.csv'), 'utf-8')
    .split('\n')
    .slice(1)
    .filter(line => line.trim() !== '');

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

// Collaborative filtering by matching skinType + skinColor
export function collaborativeFilteringRecommend(query) {
    const product = products.find(p => p.productName.toLowerCase().includes(query.toLowerCase()));
    if (!product) return [];

    const similar = products.filter(p =>
        p.skinType === product.skinType &&
        p.skinColor === product.skinColor &&
        p.productName !== product.productName
    );

    return similar.slice(0, 5).map(p => p.productName);
}
