const duroosList = document.getElementById('duroos-list');
const yearButtons = document.querySelectorAll('.year-btn');

let currentlyPlaying = null;

// The render function
function renderDuroos(yearData, year) {
  duroosList.innerHTML = ''; 

  for (const month in yearData) {
    const days = yearData[month];

    // Month Header
    const monthHeader = document.createElement('div');
    monthHeader.className = 'month-section';
    monthHeader.innerHTML = `
      <h2 class="month-header">${month} ${year}</h2> 
      <hr class="month-divider">
    `;
    duroosList.appendChild(monthHeader);

    // The Grid
    const monthGrid = document.createElement('div');
    monthGrid.className = 'grid-container';

    // The Cards
    days.forEach(day => {
      const card = document.createElement('div');
      card.className = 'surah-card';

      card.innerHTML = `
        <div class="surah-title">
          <div class="title-en">
            <span class="date">${day.date}</span>
            <h3 class="surah-name-ar">${day.title_ar}</h3>
          </div>
          <div class="title-ar">
            <h3 class="surah-name-en">${day.title}</h3>
          </div>
        </div>
        <audio controls preload="metadata" src="${day.audio_url}"></audio>
      `;

      monthGrid.appendChild(card);

      const audioEl = card.querySelector('audio');
      audioEl.addEventListener('play', () => {
        if (currentlyPlaying && currentlyPlaying !== audioEl) {
          currentlyPlaying.pause();
        }
        currentlyPlaying = audioEl;
      });
    });

    duroosList.appendChild(monthGrid);
  }
}

async function loadDuroosData() {
  if (!duroosList) {
    console.warn("No #duroos-list found. Are you on the right page?");
    return;
  }

  try {
    const response = await fetch('../data/duroos.json');
    const data = await response.json();

    renderDuroos(data['2026'], '2026');

    yearButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const selectedYear = e.target.getAttribute('data-year');
        
        yearButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        if (currentlyPlaying) {
          currentlyPlaying.pause();
          currentlyPlaying = null;
        }

        renderDuroos(data[selectedYear], selectedYear);
      });
    });

  } catch (error) {
    console.error("Failed to load Duroos data:", error);
  }
}

loadDuroosData();