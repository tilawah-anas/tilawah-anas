const khutbahList = document.getElementById("khutbah-list");
const yearButtons = document.querySelectorAll(".year-btn");

let currentlyPlaying = null;

// The main render function
function renderKhutbahs(yearData, year) {
  khutbahList.innerHTML = "";

  for (const month in yearData) {
    const weeks = yearData[month];

    // Month Header & Line
    const monthHeader = document.createElement("div");
    monthHeader.className = "month-section";
    monthHeader.innerHTML = `
      <h2 class="month-header">${month} ${year}</h2> 
      <hr class="month-divider">
    `;
    khutbahList.appendChild(monthHeader);

    // The Grid for this month
    const monthGrid = document.createElement("div");
    monthGrid.className = "grid-container";

    // Loop through each Week
    weeks.forEach((week) => {
      const card = document.createElement("div");
      card.className = "week-card";

      // Build the inner HTML for the week card
      card.innerHTML = `
        <div class="week-date">${week.date}</div>
        
        <!-- KHUTBAH SECTION -->
        <div class="audio-section">
          <div class="audio-header">
            <h3 class="surah-name-ar">${week.khutbah.title_ar}</h3>
            <h3 class="surah-name-en">${week.khutbah.title}</h3>
          </div>
          <audio controls preload="metadata" src="${week.khutbah.audio_url}"></audio>
        </div>

        <hr class="inner-divider">

        <!-- SALAH SECTION -->
        <div class="audio-section">
          <div class="audio-header">
            <h3 class="surah-name-ar">${week.salah.title_ar}</h3>
            <h3 class="surah-name-en">${week.salah.title}</h3>
          </div>
          <audio controls preload="metadata" src="${week.salah.audio_url}"></audio>
        </div>
      `;

      monthGrid.appendChild(card);

      // Audio pause logic for THIS card
      const audioElements = card.querySelectorAll("audio");
      audioElements.forEach((audioEl) => {
        audioEl.addEventListener("play", () => {
          // If another audio is playing, pause it
          if (currentlyPlaying && currentlyPlaying !== audioEl) {
            currentlyPlaying.pause();
          }
          currentlyPlaying = audioEl;
        });
      });
    });

    // Add the grid to the page
    khutbahList.appendChild(monthGrid);
  }
}

// Fetch the JSON and set up the page
async function loadKhutbahData() {
  try {
    const response = await fetch("../data/jumuah.json");
    const data = await response.json();

    // Load 2026 by default
    renderKhutbahs(data["2026"], "2026");

    // Handle the year tab clicks
    yearButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const selectedYear = e.target.getAttribute("data-year");

        // Toggle active classes
        yearButtons.forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");

        // Stop audio when switching years
        if (currentlyPlaying) {
          currentlyPlaying.pause();
          currentlyPlaying = null;
        }

        // Render the new year's data
        renderKhutbahs(data[selectedYear], selectedYear);
      });
    });
  } catch (error) {
    console.error("Failed to load Khutbah data:", error);
    khutbahList.innerHTML = "<p>Error loading recordings.</p>";
  }
}

loadKhutbahData();