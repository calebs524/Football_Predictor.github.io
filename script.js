// Load the Games.txt file into predictions.html
function loadPredictions() {
    const weekNumber = 11; // Set to the desired week number
    const weekPath = `/Predictions/Season_24-25/Week_${weekNumber}/`;
    const gamesFile = `${weekPath}Games.txt`;
    const predictionsDiv = document.getElementById('predictions');

    fetch(gamesFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the file.');
            }
            return response.text();
        })
        .then(data => {
            // Add line breaks before each "Game:" and replace other newlines with HTML line breaks
            predictionsDiv.innerHTML = data;
        })
        .catch(error => {
            predictionsDiv.textContent = 'Error loading predictions: ' + error.message;
        });
}

// Load the about.txt file into index.html
function loadBlurb() {
    const blurbDiv = document.getElementById('blurb');

    fetch('about.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the file.');
            }
            return response.text();
        })
        .then(data => {
            // Display text with new lines as HTML line breaks
            blurbDiv.innerHTML = data.replace(/\n/g, '<br>');
        })
        .catch(error => {
            blurbDiv.textContent = 'Error loading content: ' + error.message;
        });
}

// Determine which page is loaded and run appropriate function
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('predictions')) {
        loadPredictions();
    }
    if (document.getElementById('blurb')) {
        loadBlurb();
    }
});
