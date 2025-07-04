document.addEventListener('DOMContentLoaded', () => {
    loadLoveDraft();
});

function loadLoveDraft() {
    fetch('dolphins.txt')
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
            let buffer = '';
            let insideText = false;
            lines.forEach(line => {
                line = line.trim();
                if (line.startsWith('Image:')) {
                    if (buffer) {
                        sectionHtml += `<p>${buffer.trim()}</p>`;
                        buffer = '';
                    }
                    insideText = false;
                    const imgPath = line.replace('Image:', '').trim().replace(/"/g, '');
                    sectionHtml += `<div class="section-Moves"><img class="img-Moves" src="${imgPath}" alt="Draft image">`;
                } else if (line.startsWith('Text:')) {
                    // const text = line.replace('Text:', '').trim();
                    // const text2 = text.replace(/(\r\n|\r|\n)/g, ' ');
                    // sectionHtml += `<p>${text2}</p>`;
                    insideText = true;
                    buffer += line.replace('Text:', '').trim() + ' ';

                } else if (line === '') {
                    if (buffer) {
                        sectionHtml += `<p>${buffer.trim()}</p>`;
                        buffer = '';
                    }
                    sectionHtml += '</div>';  // Close section on empty line
                    insideText = false;
                } else {
                    if (insideText) {
                        buffer += line + ' ';
                    } else {
                        sectionHtml += `<p>${line}</p>`;
                    }
                }
            });
            if (buffer) {
                sectionHtml += `<p>${buffer.trim()}</p>`;
            }
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
