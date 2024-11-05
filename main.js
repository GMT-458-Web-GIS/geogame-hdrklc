window.onload = init;

let map;
let markerLayer;
let randomCoords;
let score = 0;
let startTime;
let timeLimit = 5; // 5 saniyelik zaman sınırı
let userProfile = { score: 0, locations: [], achievements: [] };

function init() {
  setRandomCoordsOnLocation();
  updateScore(0);

  if (!map) {
    map = new ol.Map({
      view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2,
        maxZoom: 6,
        minZoom: 2,
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(), // OpenStreetMap kaynağı kullanılıyor
        }),
      ],
      target: "js-map",
      controls: ol.control.defaults().extend([
        new ol.control.Zoom(),
      ]),
    });
  }

  addMarker();
  startTimer();

  document.getElementById("submit-btn").addEventListener("click", handleGuess);
  document.getElementById("restart-btn").addEventListener("click", restartGame);
}

function addMarker() {
  if (markerLayer) {
    map.removeLayer(markerLayer);
  }

  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(randomCoords)),
  });

  const markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      color: '#ff0000',
      crossOrigin: 'anonymous',
      src: 'data:image/svg+xml;charset=utf-8,' +
           encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="red" stroke="white" stroke-width="2"/></svg>'),
    }),
  });

  marker.setStyle(markerStyle);

  const vectorSource = new ol.source.Vector({
    features: [marker],
  });

  markerLayer = new ol.layer.Vector({
    source: vectorSource,
  });

  map.addLayer(markerLayer);
}

function startTimer() {
  startTime = new Date().getTime();
}

async function handleGuess() {
  const userGuess = document.getElementById("country-input").value.trim().toLowerCase();
  const resultElement = document.getElementById("result-popup");

  const currentTime = new Date().getTime();
  const timeTaken = (currentTime - startTime) / 1000; // Saniye cinsinden süre

  try {
    const location = await getLocationName(randomCoords);
    const correctGuess = userGuess === location.toLowerCase();
    let points = correctGuess && timeTaken <= timeLimit ? 2 : 1;

    if (correctGuess) {
      score += points;
      userProfile.score += points;
      userProfile.locations.push(location);
      showPopup(`Correct! 🎉 You earned ${points} point(s). The location is ${location}.`);
    } else {
      showPopup(`Wrong! ❌ The correct answer is ${location}.`);
    }

    updateScore(score);
    await showInfoPopup(location); // Bilgilendirici mesajı göster
  } catch (error) {
    showPopup('Error: Could not fetch location data.');
    console.error(error);
  }
}

async function showInfoPopup(location) {
  try {
    const response = await fetch(`https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location)}`);
    if (response.ok) {
      const data = await response.json();
      const infoElement = document.getElementById("info-popup");
      // 150 karakterden uzun ise kes ve sonuna "..." ekle
      const infoText = data.extract.length > 150 ? data.extract.substring(0, 150) + "..." : data.extract;
      infoElement.textContent = infoText || "Bu konum hakkında ek bilgi yok.";
      infoElement.classList.remove('hidden');
    } else {
      const infoElement = document.getElementById("info-popup");
      infoElement.textContent = "Bu konum hakkında ek bilgi yok.";
      infoElement.classList.remove('hidden');
    }
  } catch (error) {
    const infoElement = document.getElementById("info-popup");
    infoElement.textContent = "Bu konum hakkında ek bilgi yok.";
    infoElement.classList.remove('hidden');
  }
}

function setRandomCoordsOnLocation() {
  randomCoords = getRandomCoords();
  getLocationName(randomCoords)
    .then(location => {
      if (!location) {
        setRandomCoordsOnLocation();
      }
    })
    .catch(() => setRandomCoordsOnLocation());
}

function getRandomCoords() {
  const lat = Math.random() * 140 - 70;
  const lon = Math.random() * 360 - 180;
  return [lon, lat];
}

async function getLocationName(coords) {
  const [lon, lat] = coords;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=tr`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch location data');
  }
  const data = await response.json();
  
  if (data.address) {
    if (data.address.ocean) return data.address.ocean;
    if (data.address.water) return data.address.water;
    if (data.address.country) return data.address.country;
  }
  return null;
}

function showPopup(message) {
  const resultElement = document.getElementById("result-popup");
  resultElement.textContent = message;
  resultElement.classList.remove('hidden');
  document.getElementById("submit-btn").disabled = true;
  document.getElementById("restart-btn").classList.remove('hidden');
}

function updateScore(newScore) {
  document.getElementById("score-value").textContent = newScore;
}

function restartGame() {
  document.getElementById("submit-btn").disabled = false;
  document.getElementById("restart-btn").classList.add('hidden');
  document.getElementById("result-popup").classList.add('hidden');
  document.getElementById("info-popup").classList.add('hidden'); // Bilgilendirici popup gizlenir
  document.getElementById("country-input").value = "";
  setRandomCoordsOnLocation();
  addMarker();
  startTimer();
}
