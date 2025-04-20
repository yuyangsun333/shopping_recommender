const API = "http://localhost:3000";

async function getUserRec() {
    const id = document.getElementById("userId").value.trim();
    if (!id) return;
    const res = await fetch(`${API}/recommend/user/${id}`);
    document.getElementById("out").textContent = (await res.json()).join("\n");
}

async function getItemRec() {
    const id = document.getElementById("prodId").value.trim();
    if (!id) return;
    const res = await fetch(`${API}/recommend/item/${id}`);
    document.getElementById("out").textContent = (await res.json()).join("\n");
}
