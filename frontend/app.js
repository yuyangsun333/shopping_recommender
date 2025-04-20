const backendUrl = 'http://localhost:3000';

async function recommendByContent() {
    const skinType = document.getElementById('skinType').value;
    const skinColor = document.getElementById('skinColor').value;
    const priceRange = document.getElementById('priceRange').value.split(' ')[0]; // Extract Low/Medium/High
    const ratingPref = document.getElementById('ratingPref').value;

    const query = `${skinType},${skinColor},${priceRange},${ratingPref}`;

    const res = await fetch(`${backendUrl}/recommend/content?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    displayResults(data, 'Content-Based Recommendations');
}

async function recommendBySimilarity() {
    const input = document.getElementById('similarInput').value.trim();
    if (!input) return alert('Please enter a product keyword.');

    const res = await fetch(`${backendUrl}/recommend/collab?q=${encodeURIComponent(input)}`);
    const data = await res.json();

    displayResults(data, 'Similar Products');
}

function displayResults(products, title) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h2>${title}</h2>`;

    if (products.length === 0) {
        resultsDiv.innerHTML += '<p>No products found matching your query.</p>';
        return;
    }

    for (const product of products) {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.textContent = product;
        resultsDiv.appendChild(div);
    }
}
