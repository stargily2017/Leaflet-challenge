var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map object with options.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Create the tile layer that will be the background of our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };

        // Establish colors for depth
    }
    function mapColor(depth) {
        switch (true) {
            case depth > 90:
                return "rgba(227,86,30,0.9)";
            case depth> 70:
                return "rgba(217,135,34,0.9)";
            case depth > 50:
                return "rgba(223,159,28,0.9)";
            case depth > 30:
                return "rgba(206,185,29,0.9)";
            case depth > 10:
                return "rgba(178,197,33,0.9)";
            default:
                return "rgba(157,214,28,1)";
        }
    }
    // Establish magnitude size
    function mapRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }

    // Add earthquake data to the map
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);

// Add the legend with colors to corrolate with depth
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];

  for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap)
});