// The Rendering Function
function renderSurahs(surahs) {
  const container = document.getElementById("surah-list");
  if (!container) return;

  container.innerHTML = "";

  const allAudioPlayers = []; 

  surahs.forEach((surah) => {
    const card = document.createElement("div");
    card.className = "surah-card";

    card.innerHTML = `
      <div class="surah-title">
        <div class="title-en">
          <div class="surah-name-en">
            <span class="surah-number">${surah.id}.</span>
            <h3 class="surah-name-en">${surah.title}</h3>
          </div>  
          <p class="surah-translation">${surah.translation}</p>
        </div>
        <div class="surah-ar">
          <p class="surah-name-ar">${surah.title_ar}</p>
        </div> 
      </div> 
      
      <!-- The native audio player -->
      <audio controls preload="metadata" src="${surah.audio_url}"></audio>
    `;

    container.appendChild(card);

    const audioEl = card.querySelector('audio');
    allAudioPlayers.push(audioEl);

    audioEl.addEventListener('play', () => {
      // Loop through all the other players and pause them
      allAudioPlayers.forEach(otherAudio => {
        if (otherAudio !== audioEl) {
          otherAudio.pause();
        }
      });
    });
  });
}

// The Fetch Function
async function loadQuranData() {
  try {
    const response = await fetch("../data/quran.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const surahs = await response.json();
    renderSurahs(surahs);
  } catch (error) {
    console.error("Failed to load recitation data:", error); // Keep this one!
  }
}

// Run when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadQuranData();
});
