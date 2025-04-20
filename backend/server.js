import express from "express";
import { recommendUserCF, recommendItemCF } from "./recommender/index.js";

const app = express();
const PORT = 3000;

app.get("/", (_,res)=>res.send("Beauty Recommender API 🚀"));

app.get("/recommend/user/:uid", (req,res) => {
    res.json(recommendUserCF(req.params.uid));
});

app.get("/recommend/item/:pid", (req,res) => {
    res.json(recommendItemCF(req.params.pid));
});

app.listen(PORT, () => console.log(`→ http://localhost:${PORT}`));
