window.onload = init;

let map;
let draggableMarker; // Hareket ettirilebilir marker
let targetCountry; // Hedef ülke
let score = 0;

function init() {
  setupMap();
  generateTargetCountry();
  addDraggableMarker();

  document.getElementById("submit-btn").addEventListener("click", checkMarkerPosition);
}

function setupMap() {
  map = new ol.Map({
    view: new ol.View({
      center: ol.proj.fromLonLat([0, 0]),
      zoom: 2,
      maxZoom: 6,
      minZoom: 2,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: "js-map",
    controls: ol.control.defaults().extend([new ol.control.Zoom()]),
  });
}

function generateTargetCountry() {
  const countries = [
    "Turkey", "Russia", "China", "Brazil", "India", "United States",
    "Australia", "Canada", "Germany", "France", "Japan", "South Korea",
    "Italy", "Mexico", "Argentina", "Egypt", "South Africa", "United Kingdom",
    "Spain", "Saudi Arabia"
  ];
  targetCountry = countries[Math.floor(Math.random() * countries.length)];
  document.getElementById("country-name").textContent = targetCountry;
}

function addDraggableMarker() {
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([0, 0])),
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

  draggableMarker = new ol.layer.Vector({
    source: vectorSource,
  });

  map.addLayer(draggableMarker);

  const interaction = new ol.interaction.Modify({
    source: vectorSource,
  });

  map.addInteraction(interaction);
}

async function checkMarkerPosition() {
  const coords = draggableMarker.getSource().getFeatures()[0].getGeometry().getCoordinates();
  const [lon, lat] = ol.proj.toLonLat(coords);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
    );
    const data = await response.json();
    const location = data.address?.country;

    if (location === targetCountry) {
      score += 10; // Puan ekle
      updateScore();
      showPopup(`🎉 Correct! You found ${targetCountry}.`, "success");
      resetMarker(); // Marker'ı yeniden konumlandır
      generateTargetCountry(); // Yeni hedef belirle
    } else {
      showPopup(`❌ Wrong! The correct country was ${targetCountry}.`, "error");
      restartGame(); // Oyunu bitir
    }
  } catch (error) {
    console.error("Error checking position:", error);
    showPopup("❌ Error! Could not check the position.", "error");
  }
}

function updateScore() {
  document.getElementById("score-value").textContent = score;
}

function resetMarker() {
  const vectorSource = draggableMarker.getSource();
  vectorSource.clear();

  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([0, 0])),
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
  vectorSource.addFeature(marker);
}

function restartGame() {
  showPopup("Game Over! Click OK to restart.", "error");
  score = 0;
  updateScore();
  resetMarker();
  generateTargetCountry();
}

function showPopup(message, type) {
  const popup = document.createElement("div");
  popup.classList.add("popup", type);
  popup.textContent = message;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("fade-out");
    popup.addEventListener("transitionend", () => {
      popup.remove();
    });
  }, 3000);
}
