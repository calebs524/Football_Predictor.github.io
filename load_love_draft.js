document.addEventListener('DOMContentLoaded', () => {
    loadLoveDraft();
});

function loadLoveDraft() {
    fetch('Moves/Love_Draft/RVLD.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load file: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const main = document.querySelector('main');
            const lines = data.split('\n');
            let sectionHtml = '';
            lines.forEach(line => {
                line = line.trim();
                if (line.startsWith('Image:')) {
                    const imgPath = line.replace('Image:', '').trim().replace(/"/g, '');
                    sectionHtml += `<div class="section-Moves"><img class="img-Moves" src="Moves/Love_Draft/JLD/${imgPath}" alt="Draft image">`;
                } else if (line.startsWith('Text:')) {
                    const text = line.replace('Text:', '').trim();
                    const text2 = text.replace(/\n/g, ' ');
                    sectionHtml += `<p>${text2}</p>`;
                } else if (line === '') {
                    sectionHtml += '</div>';  // Close section on empty line
                } else {
                    sectionHtml += `<p>${line}</p>`;
                }
            });
            // Close final section if not closed
            if (!sectionHtml.endsWith('</div>')) {
                sectionHtml += '</div>';
            }
            main.innerHTML += sectionHtml;
        })
        .catch(error => {
            console.error('Error loading draft:', error);
            const main = document.querySelector('main');
            main.innerHTML += `<p style="color:red;">Error loading draft: ${error.message}</p>`;
        });
}
