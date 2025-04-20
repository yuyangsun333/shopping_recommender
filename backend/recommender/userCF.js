import { loadRows } from "../dataLoader.js";

/** build user→{item:rating} sparse map */
function buildUserMap(rows) {
    const map = {};
    rows.forEach(r => {
        (map[r.user_id] ??= {})[r.product_id] = r.rating;
    });
    return map;
}

/** naive overlap similarity & top‑N recommendations */
export function recommendUserCF(targetUserId, topN = 10) {
    const rows  = loadRows();
    const users = buildUserMap(rows);
    const target = users[targetUserId];
    if (!target) return [];

    const sim = {};
    for (const [u, ratings] of Object.entries(users)) {
        if (u === targetUserId) continue;
        let overlap = 0;
        for (const item of Object.keys(target)) {
            if (item in ratings) overlap++;
        }
        if (overlap) sim[u] = overlap;
    }

    const topSimilar = Object.entries(sim)
        .sort((a,b)=>b[1]-a[1])
        .slice(0, 20)
        .map(([u]) => u);

    const score = {};
    for (const u of topSimilar) {
        for (const [item, rating] of Object.entries(users[u])) {
            if (item in target) continue;
            score[item] = (score[item] ?? 0) + rating;
        }
    }

    return Object.entries(score)
        .sort((a,b)=>b[1]-a[1])
        .slice(0, topN)
        .map(([item]) => item);
}
