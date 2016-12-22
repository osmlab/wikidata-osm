'use strict';

/* global App */
var mapboxglLive = require('./mapbox-gl-live');

var threshold = 100;
mapboxgl.accessToken = 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2l2dzVxbzA3MDAwNDJzbDUzMzVzbXc5dSJ9.WZ4_UtVvuVmOw4ofNMkiJw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 3,
    center: [
        21.6, 7.6
    ],
    hash: true
});

map.addControl(new MapboxGeocoder({accessToken: mapboxgl.accessToken}));

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
                    [
                        0, 0
                    ],
                    [
                        threshold/20, 4
                    ],
                    [
                        threshold/10, 8
                    ],
                    [threshold, 20]
                ]
            },
            "circle-color": {
                "property": 'distance',
                "stops": [
                    [
                        0, '#ffffff'
                    ],
                    [
                        threshold/20, '#00ff00'
                    ],
                    [threshold/10, '#ffff00'],
                    [threshold, '#ff0000']
                ]
            }
        }
    });
    document.getElementById('slider').addEventListener('input', function(e) {
        var distance = parseInt(e.target.value, 10);
        threshold = distance;
        repaintLayer(distance);
    });
    repaintLayer(100);
    // Inspect wikidata layer on click and show popup information
    mapboxglLive.inspector(map, {layers: ['wikidata-layer']});

});

function repaintLayer(threshold) {
    map.setPaintProperty('wikidata-layer',"circle-radius", {
        "property": 'distance',
        'stops': [
            [
                0, 0
            ],
            [
                threshold/20, 4
            ],
            [
                threshold/10, 8
            ],
            [threshold, 20]
        ]
    });
    map.setPaintProperty('wikidata-layer',"circle-color", {
        "property": 'distance',
        "stops": [
            [
                0, '#ffffff'
            ],
            [
                threshold/20, '#00ff00'
            ],
            [threshold/10, '#ffff00'],
            [threshold, '#ff0000']
        ]
    });
    document.getElementById('Distance').textContent = threshold;

}
