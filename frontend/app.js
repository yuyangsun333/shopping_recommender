async function getRecommendation() {
    const mode = document.getElementById("mode").value;
    const id = document.getElementById("inputId").value;

    let url = "";

    if (mode === "user") {
        url = `http://localhost:3000/recommend/user/${id}`;
    } else {
        url = `http://localhost:3000/recommend/item/${id}`;
    }

    try {
        const response = await fetch(url);
        const recommendations = await response.json();

        document.getElementById("result").innerHTML = `
            <h2>Recommendations:</h2>
            <ul>
                ${recommendations.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById("result").innerHTML = "Error fetching recommendations.";
    }
}
