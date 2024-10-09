const weekNumber = 6; // You can change this to load different weeks dynamically
const weekPath = `/Predictions/Season_24-25/Week_${weekNumber}/`;
const sourcesFile = `${weekPath}Sources.json`; // File that lists all the JSON games for this week

const predictionsDiv = document.getElementById('predictions');

// Fetch the Sources.json file to get the list of game files
console.log(sourcesFile)
fetch(weekPath + sourcesFile)
    .then(response => response.json())
    .then(data => {
        // Loop through the array of game files and load each one
        data.games.forEach(file => {
            loadGameData(weekPath + file);
        });
    })
    .catch(error => console.error('Error fetching sources:', error));

// Function to fetch and display data from each game JSON file
function loadGameData(filePath) {
    fetch(filePath)
    console.log(filePath)
        .then(response => response.json())
        .then(data => {
            const gameInfo = `
                <div class="game">
                    <h2>${data.Game}</h2>
                    <p><strong>Location:</strong> ${data.Location}</p>
                    <p><strong>Home Team:</strong> ${data['Home Team']} (${data['Home Team Record']})</p>
                    <p><strong>Away Team:</strong> ${data['Away Team']} (${data['Away Team Record']})</p>
                    <p><strong>Date:</strong> ${data.Date} at ${data.Time}</p>
                    <p><strong>Winner:</strong> ${data.Winner}</p>
                    <p><strong>Score:</strong> ${data.Score}</p>
                    <p><strong>Comments:</strong> ${data.Comments}</p>
                </div>
            `;
            predictionsDiv.innerHTML += gameInfo;
        })
        .catch(error => console.error('Error fetching game data:', error));
}
