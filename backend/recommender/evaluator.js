import { loadRows } from "../dataLoader.js";
import { recommendUserCF } from "./userCF.js";
import { recommendItemCF } from "./itemCF.js";

const rows = loadRows();
const users = [...new Set(rows.map(r=>r.user_id))].slice(0, 1000);

function hitRate(recommender, label) {
    let hits = 0;
    for (const uid of users) {
        // pick first rating as "held‑out"
        const held = rows.find(r => r.user_id === uid);
        if (!held) continue;
        const recs = recommender(uid, 10);
        if (recs.includes(held.product_id)) hits++;
    }
    console.log(`${label}: Hit@10 = ${(hits/users.length*100).toFixed(2)}%`);
}

hitRate(recommendUserCF, "User‑CF");
hitRate(
    uid=>recommendItemCF(rows.find(r=>r.user_id===uid)?.product_id),
    "Item‑CF"
);
