mapboxgl.accessToken = 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2l2dzVxbzA3MDAwNDJzbDUzMzVzbXc5dSJ9.WZ4_UtVvuVmOw4ofNMkiJw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 1.4,
    center: [21.6, 7.6],
    hash: true
});

map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}));

map.on('load', function() {
    map.addSource('wikidata-source', {
        type: 'vector',
        url: 'mapbox://amisha.wikidata_planet_geojson'
    });
    map.addLayer({
        "id": "wikidata-layer",
        "type": "circle",
        "source": "wikidata-source",
        "source-layer": "wikidata_planet_geojson",
        "paint": {
            "circle-radius": {
                "property": 'distance',
                'stops': [
                    [0, 1],
                    [5, 4],
                    [10, 8],
                    [100, 20]
                ]
            },
            "circle-color": {
                "property": 'distance',
                "stops": [
                    [0, '#00ff00'],
                    [5, '#ffff00'],
                    [10, '#ff0000']
                ]
            }
        }
    });


});

map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['wikidata-layer']
    });

    if (!features.length) {
        return;
    }

    var feature = features[0];

    var lngLat1, lngLat2;
    $.getJSON("http://www.wikidata.org/w/api.php?action=wbgetentities&ids=" + feature.properties.wikidata + "&format=json&callback=?", function(data) {
        if (data["entities"]) {
            var latitude = data["entities"][feature.properties.wikidata]["claims"]["P625"][0]["mainsnak"]["datavalue"]["value"]["latitude"];
            var longitude = data["entities"][feature.properties.wikidata]["claims"]["P625"][0]["mainsnak"]["datavalue"]["value"]["longitude"];
            lngLat1 = new mapboxgl.LngLat(longitude, latitude);
            lngLat2 = new mapboxgl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);
            var distance = getDistance(lngLat1, lngLat2);
            feature.properties.distance = distance;
            var popupHTML = populateTable(feature);
            var popup = new mapboxgl.Popup()
                .setLngLat(feature.geometry.coordinates)
                .setHTML(popupHTML)
                .addTo(map);
        }
    });
});

map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['wikidata-layer']
    });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});

function populateTable(feature) {
    // Populate the popup and set its coordinates
    // based on the feature found.

    var left = feature.geometry.coordinates[0] - 1;
    var top = feature.geometry.coordinates[1] - 1;
    var right = feature.geometry.coordinates[0] + 1;
    var bottom = feature.geometry.coordinates[1] + 1;
    var popupHTML = "<h3>" + feature.properties.name + "</h3>";
    popupHTML += "<a href='https://www.wikidata.org/wiki/" + feature.properties.wikidata + "'>Wikidata</a><br>";
    popupHTML += "<a href='http://nominatim.openstreetmap.org/search.php?q=" +
                  feature.properties.name +
                  "&polygon=1&bounded=1&viewbox=" + left + "%2C" + top + "%2C" + right + "%2C" + bottom + "'>OSM</a><br>";

    popupHTML += "<table style='table-layout:fixed'>";
    for(property in feature.properties) {
        if (property == 'distance') {
            var distance = feature.properties[property];
            popupHTML += "<tr bgcolor = #d5e8ce><td>" + property + "</td><td>" + parseFloat(distance.toFixed(3)) + "</td></tr>";
        } else {
            popupHTML += "<tr><td>" + property + "</td><td>" + feature.properties[property] + "</td></tr>";
        }
    }
    popupHTML += "</table>";

    return popupHTML;
}

function getDistance(lnglat1, lnglat2) {
    // Uses spherical law of cosines approximation.
    const R = 6371000;

    const rad = Math.PI / 180,
        lat1 = lnglat1.lat * rad,
        lat2 = lnglat2.lat * rad,
        a = Math.sin(lat1) * Math.sin(lat2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.cos((lnglat2.lng - lnglat1.lng) * rad);

    const maxMeters = R * Math.acos(Math.min(a, 1));
    return maxMeters / 1000;
}
