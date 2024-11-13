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
                    <p><strong>Post Game Analysis:</strong> ${data['Post Game Analysis']}</p>
                </div>
            `;
            predictionsDiv.innerHTML += gameInfo;
        })
        .catch(error => console.error('Error fetching game data:', error));
}

// Function to load the content of about.txt and inject it into the page
function loadBlurb(filePath, elementId) {
    // Use fetch to retrieve the file at the provided filePath
    fetch(filePath)
        .then(response => {
            // Check if the request was successful
            if (!response.ok) {
                // If there's an error, throw it so it can be caught in the catch block
                throw new Error('Failed to fetch the file.');
            }
            // Convert the file content to text and return it
            return response.text();
        })
        .then(data => {
            // Use the returned data (text from the file) and inject it into the HTML element with the given elementId
            document.getElementById(elementId).innerText = data;
        })
        .catch(error => {
            // If there is an error (like file not found), display a user-friendly error message
            document.getElementById(elementId).innerText = 'Error loading content: ' + error.message;
        });
}

// Wait for the DOM content to fully load before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Call the loadBlurb function, specifying the path to about.txt and the element where the text should be displayed
    loadBlurb('about.txt', 'blurb');
});

