const userButton = document.getElementById('userButton');
const itemButton = document.getElementById('itemButton');
const userInput = document.getElementById('userInput');
const itemInput = document.getElementById('itemInput');
const resultDiv = document.getElementById('result');

userButton.addEventListener('click', async () => {
    const userId = userInput.value.trim();
    if (!userId) {
        resultDiv.innerHTML = '<p>Please enter a User ID.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/recommend/user/${userId}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        resultDiv.innerHTML = '<p>Error fetching recommendations.</p>';
        console.error(error);
    }
});

itemButton.addEventListener('click', async () => {
    const itemId = itemInput.value.trim();
    if (!itemId) {
        resultDiv.innerHTML = '<p>Please enter a Product ID.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/recommend/item/${itemId}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        resultDiv.innerHTML = '<p>Error fetching recommendations.</p>';
        console.error(error);
    }
});

function displayResults(recommendations) {
    if (recommendations.length === 0) {
        resultDiv.innerHTML = '<p>No recommendations found.</p>';
        return;
    }

    const list = recommendations.map(item => `<li>${item}</li>`).join('');
    resultDiv.innerHTML = `<ul>${list}</ul>`;
}
