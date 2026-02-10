// ЗАМІНІТЬ ЦЕ ПОСИЛАННЯ НА ВАШЕ (Отримане в Google Sheets як CSV)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsbvgVRNPv7sYvbK3SnMbXmBYN1dK9xElUHH9Tlg4LfYYDdfT2FFKP51p9C46OGbORiNQrvt3aUdCd/pub?output=csv';

async function updateAllProjects() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Ігноруємо заголовок

        rows.forEach((row, index) => {
            const columns = row.split(',');
            if (columns.length < 3) return;

            const projectInfo = {
                raised: parseInt(columns[1]),
                goal: parseInt(columns[2]),
                certs: columns[3] || '0'
            };

            updateProjectUI(index + 1, projectInfo);
        });
    } catch (error) {
        console.error('Помилка завантаження даних:', error);
    }
}

function updateProjectUI(id, data) {
    // Шукаємо ВСІ блоки з цим індексом (і в закритій, і у відкритій картці)
    const cards = document.querySelectorAll(`.project-card[data-project-index="${id}"]`);

    if (cards.length === 0) return;

    cards.forEach(card => {
        const progress = Math.min(data.raised / data.goal, 1);
        const percent = (progress * 100).toFixed(1).replace('.', ',');

        // Оновлення тексту
        card.querySelector('.raised-text').innerText = data.raised.toLocaleString();
        card.querySelector('.goal-text').innerText = data.goal.toLocaleString();
        card.querySelector('.certs-text').innerText = data.certs;
        card.querySelector('.percent-text').innerText = percent + ' %';

        const totalPath = card.querySelector('.path-total');
        const progressPath = card.querySelector('.path-progress');
        const fillPath = card.querySelector('.path-fill');
        const dot = card.querySelector('.dot-current');

        // Отримуємо довжину лінії (важливо робити це для кожного екземпляра окремо)
        const length = totalPath.getTotalLength();
        const currentLen = length * progress;

        // 1. Малюємо лінію
        progressPath.setAttribute('d', totalPath.getAttribute('d'));
        progressPath.style.strokeDasharray = length;
        progressPath.style.strokeDashoffset = length - currentLen;

        // 2. Позиціонуємо точку
        const point = totalPath.getPointAtLength(currentLen);
        dot.setAttribute('cx', point.x);
        dot.setAttribute('cy', point.y);

        // 3. Малюємо градієнтну заливку (висота 80, як у вашому новому коді)
        let fillD = `M0,80 `;
        for (let i = 0; i <= currentLen; i += 2) {
            let p = totalPath.getPointAtLength(i);
            fillD += `L${p.x},${p.y} `;
        }
        fillD += `L${point.x},80 Z`;
        fillPath.setAttribute('d', fillD);
    });
}

// Завантажуємо дані при старті
updateAllProjects();
// Оновлюємо кожну годину без перезавантаження сторінки
setInterval(updateAllProjects, 3600000);
