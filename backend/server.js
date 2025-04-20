import express from "express";
import cors     from "cors";
import { recommendUserCF }  from "./recommender/userCF.js";
import { recommendItemCF }  from "./recommender/itemCF.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.get("/", (_,res)=>res.send("Beauty Recommender API "));

// user-based
app.get("/recommend/user/:uid", (req, res) => {
    const uid = req.params.uid;
    const list = recommendUserCF(uid, 10);        // top‑10
    res.json({ mode:"user", uid, recommendations: list });
});

// item-based
app.get("/recommend/item/:pid", (req, res) => {
    const pid = req.params.pid;
    const list = recommendItemCF(pid, 10);        // top‑10
    res.json({ mode:"item", pid, recommendations: list });
});

app.listen(PORT, () => console.log(`→ http://localhost:${PORT}`));
