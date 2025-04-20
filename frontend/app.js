const API = "http://localhost:3000";

async function getUserRec() {
    const uid = document.getElementById("uid").value.trim();
    if (!uid) return;
    const r   = await fetch(`${API}/recommend/user/${uid}`);
    const { recommendations } = await r.json();
    render(recommendations, `Top products for user ${uid}`);
}

async function getItemRec() {
    const pid = document.getElementById("pid").value.trim();
    if (!pid) return;
    const r   = await fetch(`${API}/recommend/item/${pid}`);
    const { recommendations } = await r.json();
    render(recommendations, `Products similar to ${pid}`);
}

function render(list, title) {
    const box = document.getElementById("out");
    box.textContent = `${title}\n——————————————\n` + list.join("\n");
}
