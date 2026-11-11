// We wait for the HTML to load first
document.addEventListener("DOMContentLoaded", () => {
  // Check if we are actually on the Ramadan page
  const ramadanList = document.getElementById("ramadan-list");
  if (!ramadanList) return; // If not, stop here!

  const yearButtons = document.querySelectorAll(".year-btn");
  let currentlyPlaying = null; // Keeps track of audio

  // The function to build the cards
  function renderRamadanCards(recordings) {
    ramadanList.innerHTML = "";

    if (!recordings || recordings.length === 0) {
      ramadanList.innerHTML =
        "<p>No recordings available for this year yet.</p>";
      return;
    }

    recordings.forEach((recording) => {
      const card = document.createElement("div");
      card.className = recording.title ? 'surah-card' : 'surah-card single-title';

      // Set the main title (fallback to surah if title is missing)
      const mainTitleEn = recording.title || recording.surah;
      const mainTitleAr = recording.title_ar || recording.surah_ar;

      // Only show the subtitle if a title actually exists
      const subtitleEn = recording.title
        ? `<span class="surah-subtitle-en">${recording.surah}</span>`
        : "";
      const subtitleAr = recording.title_ar
        ? `<span class="surah-subtitle-ar">${recording.surah_ar}</span>`
        : "";

      // Your exact HTML structure
      card.innerHTML = `
        <div class="player-text">
          <div class="title">
            <h3 class="surah-name-en">${mainTitleEn}</h3>
            ${subtitleEn}
          </div>
          <div class="subtitle">
            <h3 class="surah-name-ar">${mainTitleAr}</h3>
            ${subtitleAr}
          </div>
        </div>
        <audio controls preload="metadata" src="${recording.audio_url}"></audio>
        `;

      ramadanList.appendChild(card);

      // Audio pause logic
      const audioEl = card.querySelector("audio");
      audioEl.addEventListener("play", () => {
        if (currentlyPlaying && currentlyPlaying !== audioEl) {
          currentlyPlaying.pause();
        }
        currentlyPlaying = audioEl;
      });
    });
  }

  // Fetch the JSON and set up the page
  async function loadData() {
    try {
      const response = await fetch("../data/ramadan.json");

      // Check if the file was found
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Load 1446 by default
      renderRamadanCards(data["1446"]);

      // Handle the button clicks
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
          renderRamadanCards(data[selectedYear]);
        });
      });
    } catch (error) {
      console.error("Failed to load Ramadan data:", error);
      ramadanList.innerHTML = "<p>Error loading recordings.</p>";
    }
  }

  // Run the fetch!
  loadData();
});
