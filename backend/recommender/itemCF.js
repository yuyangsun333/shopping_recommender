import { loadRows } from "../dataLoader.js";

function buildItemUsers(rows) {
    const map = {};
    rows.forEach(r => {
        (map[r.product_id] ??= new Set()).add(r.user_id);
    });
    return map;
}

export function recommendItemCF(targetItemId, topN = 10) {
    const rows = loadRows();
    const itemUsers = buildItemUsers(rows);
    const targetUsers = itemUsers[targetItemId];
    if (!targetUsers) return [];

    const overlap = {};
    for (const [item, users] of Object.entries(itemUsers)) {
        if (item === targetItemId) continue;
        let common = 0;
        users.forEach(u => { if (targetUsers.has(u)) common++; });
        if (common) overlap[item] = common;
    }

    return Object.entries(overlap)
        .sort((a,b)=>b[1]-a[1])
        .slice(0, topN)
        .map(([item]) => item);
}
