const BACK = 'http://localhost:3000';

async function runFilter() {
    const skinType = document.getElementById('skinType').value;
    const priceMin = document.getElementById('minPrice').value;
    const priceMax = document.getElementById('maxPrice').value;
    const minRating = document.getElementById('minRating').value;
    const brand    = document.getElementById('brandInput').value.trim();

    const body = {
        skinType: skinType || null,
        priceMin: priceMin ? Number(priceMin) : null,
        priceMax: priceMax ? Number(priceMax) : null,
        minRating: minRating ? Number(minRating) : null,
        brand: brand || null
    };

    const res  = await fetch(`${BACK}/recommend/filter`, {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify(body)
    });

    const data = await res.json();
    render(data, 'Attribute-Based Recommendations');
}

async function runContent() {
    const kw = document.getElementById('keyword').value.trim();
    if (!kw) return alert('Please enter a keyword!');
    const res = await fetch(`${BACK}/recommend/content?q=${encodeURIComponent(kw)}`);
    const data = await res.json();
    render(data, 'Content-Based Recommendations');
}

function render(list, title) {
    const out = document.getElementById('results');
    out.innerHTML = `<h3>${title}</h3>`;
    if (!list.length) { out.innerHTML += '<p>No products found.</p>'; return; }
    list.forEach(p => {
        out.innerHTML += `
            <div class="result-item">
                <strong>${p.product_name}</strong><br>
                Brand: ${p.brand} • $${p.price} • ⭐${p.rating}
            </div>
        `;
    });
}

window.runFilter = runFilter;
window.runContent = runContent;
