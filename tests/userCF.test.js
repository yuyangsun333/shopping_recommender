import { recommendUserCF } from "../backend/recommender/userCF.js";
console.log("userCF test: returns array?", Array.isArray(recommendUserCF("foo")));
