import fs   from "fs";
import path from "path";
const CACHE = {};

export function loadRows(file = "data/cleaned_beauty.json") {
    if (CACHE[file]) return CACHE[file];
    const abs = path.join(process.cwd(), "data", file);
    const rows = fs.readFileSync(abs, "utf8").trim().split("\n")
        .map(l => JSON.parse(l));
    return (CACHE[file] = rows);
}
