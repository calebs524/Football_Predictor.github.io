// function sanitizeTeamName(name) {
//     // Lowercase, remove non-alphanumeric (for matching logo filenames)
//     return name.toLowerCase().replace(/[^a-z0-9]/g, '');
// }


const teamNicknameMap = {
    "Arizona Cardinals": "Cardinals",
    "Atlanta Falcons": "Falcons",
    "Baltimore Ravens": "Ravens",
    "Buffalo Bills": "Bills",
    "Carolina Panthers": "Panthers",
    "Chicago Bears": "Bears",
    "Cincinnati Bengals": "Bengals",
    "Cleveland Browns": "Browns",
    "Dallas Cowboys": "Cowboys",
    "Denver Broncos": "Broncos",
    "Detroit Lions": "Lions",
    "Green Bay Packers": "Packers",
    "Houston Texans": "Texans",
    "Indianapolis Colts": "Colts",
    "Jacksonville Jaguars": "Jaguars",
    "Kansas City Chiefs": "Chiefs",
    "Las Vegas Raiders": "Raiders",
    "Los Angeles Chargers": "Chargers",
    "Los Angeles Rams": "Rams",
    "Miami Dolphins": "Dolphins",
    "Minnesota Vikings": "Vikings",
    "New England Patriots": "Patriots",
    "New Orleans Saints": "Saints",
    "New York Giants": "Giants",
    "New York Jets": "Jets",
    "Philadelphia Eagles": "Eagles",
    "Pittsburgh Steelers": "Steelers",
    "San Francisco 49ers": "49ers",
    "Seattle Seahawks": "Seahawks",
    "Tampa Bay Buccaneers": "Buccaneers",
    "Tennessee Titans": "Titans",
    "Washington Commanders": "Commanders",

    // Also map nicknames to themselves for extra safety
    "Cardinals": "Cardinals",
    "Falcons": "Falcons",
    "Ravens": "Ravens",
    "Bills": "Bills",
    "Panthers": "Panthers",
    "Bears": "Bears",
    "Bengals": "Bengals",
    "Browns": "Browns",
    "Cowboys": "Cowboys",
    "Broncos": "Broncos",
    "Lions": "Lions",
    "Packers": "Packers",
    "Texans": "Texans",
    "Colts": "Colts",
    "Jaguars": "Jaguars",
    "Chiefs": "Chiefs",
    "Raiders": "Raiders",
    "Chargers": "Chargers",
    "Rams": "Rams",
    "Dolphins": "Dolphins",
    "Vikings": "Vikings",
    "Patriots": "Patriots",
    "Saints": "Saints",
    "Giants": "Giants",
    "Jets": "Jets",
    "Eagles": "Eagles",
    "Steelers": "Steelers",
    "49ers": "49ers",
    "Seahawks": "Seahawks",
    "Buccaneers": "Buccaneers",
    "Titans": "Titans",
    "Commanders": "Commanders"
};

function sanitizeTeamName(team) {
    // Remove extra spaces
    team = team.trim();
    console.log(team)
    // Try to map full name to nickname
    if (teamNicknameMap[team]) {
        return teamNicknameMap[team];
    }
    // Fallback: Capitalize and singularize
    return team.charAt(0).toUpperCase() + team.slice(1).toLowerCase();
}

function loadPredictions() {
    fetch('Games.txt')
        .then(response => response.text())
        .then(data => {
            let byesBlock = '';
            // Separate Byes section if it exists
            let [gamesText, ...byesArr] = data.split(/Teams On Bye:/i);
            if (byesArr.length) byesBlock = byesArr.join('').trim();

            const games = gamesText.trim().split(/\n\s*\n/); // Split at blank lines
            const gamesHtml = games.map(gameBlock => {
                const lines = gameBlock.split('\n').map(l => l.trim());
                const matchupLine = lines.find(l => l.toLowerCase().startsWith('game:')) || lines[0];
                let teamsMatch = matchupLine.match(/game:(.*?)\s+[@v][s]*\s+(.*)/i);
                if (!teamsMatch) return '';
                let team1 = teamsMatch[1].trim();
                let team2 = teamsMatch[2].trim();
                let logo1 = `img/logos/${sanitizeTeamName(team1)}.png`;
                let logo2 = `img/logos/${sanitizeTeamName(team2)}.png`;
                const blurb = lines.filter(l => l !== matchupLine).join('<br>');

                return `
                  <div class="game-card">
                    <img class="team-logo" src="${logo1}" alt="${team1} logo" onerror="this.style.opacity=0.2">
                    <div class="game-blurb">
                      <div class="game-header">
                        <span class="team-name">${team1}</span> <b>@</b> <span class="team-name">${team2}</span>
                      </div>
                      <div class="prediction-details">${blurb}</div>
                    </div>
                    <img class="team-logo" src="${logo2}" alt="${team2} logo" onerror="this.style.opacity=0.2">
                  </div>
                `;
            }).join('');

            // Handle Byes section
            let byesHtml = '';
            if (byesBlock) {
                // Split by line or comma, trim, filter out empty lines
                let byeTeams = byesBlock.split(/[\n,]/).map(t => t.trim()).filter(Boolean);
                byesHtml = `
                  <div class="byes-card">
                    <div class="byes-header">Bye Teams</div>
                    <div class="byes-logos">
                      ${byeTeams.map(team =>
                    `<div class="bye-team">
                           <img src="img/logos/${sanitizeTeamName(team)}.png" alt="${team} logo" onerror="this.style.opacity=0.2">
                           <span>${team}</span>
                         </div>`
                ).join('')}
                    </div>
                  </div>
                `;
            }

            document.getElementById('predictions').innerHTML = gamesHtml + byesHtml;
        })
        .catch(error => {
            document.getElementById('predictions').textContent = 'Error loading predictions: ' + error.message;
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
