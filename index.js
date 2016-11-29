'use strict';

/* global App */
var mapboxglLive = require('./mapbox-gl-live');

mapboxgl.accessToken = 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2l2dzVxbzA3MDAwNDJzbDUzMzVzbXc5dSJ9.WZ4_UtVvuVmOw4ofNMkiJw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 3,
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

    // Inspect wikidata layer on click and show popup information
    mapboxglLive.inspector(map, {layers: ['wikidata-layer'] });


});
