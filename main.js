window.onload = init;

let randomCoords = getRandomCoords(); // Rastgele koordinat oluştur

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: ol.proj.fromLonLat([0, 0]),
      zoom: 2,
      maxZoom: 6,
      minZoom: 2,
      rotation: 0,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: "js-map",
  });

  // Rastgele marker ekleme
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

  const markerLayer = new ol.layer.Vector({
    source: vectorSource,
  });

  map.addLayer(markerLayer);

  // Tahmin butonuna tıklama olayı
  document.getElementById("submit-btn").addEventListener("click", async () => {
    const userGuess = document.getElementById("country-input").value.trim().toLowerCase();
    const resultElement = document.getElementById("result-popup");

    try {
      const country = await getCountryName(randomCoords);
      console.log(`Random country: ${country}`); // Debug için log ekledik
      if (userGuess === country.toLowerCase()) {
        showPopup(resultElement, `Correct! 🎉 It's ${country}.`);
      } else {
        showPopup(resultElement, `Wrong! ❌ The correct answer is ${country}.`);
      }
    } catch (error) {
      showPopup(resultElement, 'Error: Could not fetch country data.');
      console.error(error);
    }
  });
}

// Rastgele koordinat üretici
function getRandomCoords() {
  const lat = Math.random() * 180 - 90; // -90 ile 90 arasında enlem
  const lon = Math.random() * 360 - 180; // -180 ile 180 arasında boylam
  return [lon, lat];
}

// OpenStreetMap API'sinden ülke ismini almak
async function getCountryName(coords) {
  const [lon, lat] = coords;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch country data');
  }
  const data = await response.json();
  console.log(data); // Debug için: Gelen veriyi loglayalım
  return data.address.country;
}

// Bildirim popup'ını gösterme
function showPopup(element, message) {
  element.textContent = message;
  element.classList.remove('hidden');
  setTimeout(() => {
    element.classList.add('hidden');
  }, 3000); // 3 saniye sonra kaybolur
}
