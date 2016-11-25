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
        "source-layer": "wikidata",
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

    // Populate the popup and set its coordinates
    // based on the feature found.

    var popupHTML = "<h3>" + feature.properties.name + "</h3>";
    popupHTML += "<a href='https://www.wikidata.org/wiki/" + feature.properties.wikidata + "'>Wikidata</a><br>";
    popupHTML += JSON.stringify(feature.properties);

    var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(popupHTML)
        .addTo(map);
});

map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['wikidata-layer']
    });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});
