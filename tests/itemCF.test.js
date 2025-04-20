import { recommendItemCF } from "../backend/recommender/itemCF.js";
console.log("itemCF test: returns array?", Array.isArray(recommendItemCF("bar")));
