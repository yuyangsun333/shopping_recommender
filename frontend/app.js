async function recommendByUser() {
    const userId = document.getElementById('userIdInput').value;
    if (!userId) return alert('Please enter a User ID.');

    const response = await fetch(`http://localhost:3000/user-recommend/${userId}`);
    const data = await response.json();

    document.getElementById('userRecommendations').innerHTML =
        '<h3>Recommendations:</h3><ul>' + data.recommendations.map(item => `<li>${item}</li>`).join('') + '</ul>';
}

async function recommendByItem() {
    const itemId = document.getElementById('itemIdInput').value;
    if (!itemId) return alert('Please enter a Product ID.');

    const response = await fetch(`http://localhost:3000/item-recommend/${itemId}`);
    const data = await response.json();

    document.getElementById('itemRecommendations').innerHTML =
        '<h3>Recommendations:</h3><ul>' + data.recommendations.map(item => `<li>${item}</li>`).join('') + '</ul>';
}
