// Initialize the map
var map = L.map("map").setView([16.047079, 107.872375], 6);

// Load and add the GeoJSON layer for Vietnam
fetch("vietnam-geo.json")
  .then((response) => response.json())
  .then((data) => {
    L.geoJSON(data, {
      style: function (feature) {
        return {
          color: "#ff7800", // Border color
          weight: 4,
          fillColor: "#fefefe", // Fill color
          fillOpacity: 0,
        };
      },
    }).addTo(map);
  });

var sheety =
  "https://api.sheety.co/c470de579f81934d9a639bbf913f8974/travelMap/sheet1";

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Define the southwest and northeast bounds of Vietnam
var southWest = L.latLng(8.2, 102.1),
  northEast = L.latLng(23.4, 109.5),
  bounds = L.latLngBounds(southWest, northEast);

// Restrict the map view to Vietnam
map.setMaxBounds(bounds);
map.setMinZoom(6);

// Object to store markers
var markers = {};

// Function to fetch marker data and load markers
function fetchAndLoadMarkers() {
  fetch(sheety) // Replace with the URL to your API or JSON file
    .then((response) => response.json())
    .then((data) => {
      console.log({ data });
      data?.sheet1?.forEach((markerInfo) => {
        L.marker([markerInfo.latitude, markerInfo.longitude])
          .bindPopup(`${markerInfo.popupText}`)
          .addTo(map);
      });
    })
    .catch((error) => {
      console.error("Error fetching marker data:", error);
    });
}

// Call the function on initialization
fetchAndLoadMarkers();

let popupText = ''
function addMarkerWithPopup(lat, lng) {
  popupText = prompt(
    "Vui lòng nhập nội dung: ",
    "cc"
  );
  if (popupText !== null && popupText.trim() !== "") {
    var marker = L.marker([lat, lng], {
      riseOnHover: true,
      draggable: true,
      title: "Resource Location",
      alt: "Resource Location",
    }).addTo(map);
    marker
      .bindPopup(`<span>${popupText}</span>`)
      .openPopup();
  }
}

// Function to add or remove markers
function toggleMarker(lat, lng) {
  addMarkerWithPopup(lat, lng);
  fetch(sheety, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sheet1: { latitude: lat, longitude: lng, popupText: popupText },
    }),
  })
    .then((response) => response.json())
    .then((newMarker) => {
      return 1;
    })
    .catch((err) => {
      console.error(err);
      delete markers[key];
    })
    .finally(() => {
        popupText = '';
    })
}

// Map click event to add/remove markers
map.on("click", function (e) {
  toggleMarker(e.latlng.lat, e.latlng.lng);
});