mapboxgl.accessToken = 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2l2dzVxbzA3MDAwNDJzbDUzMzVzbXc5dSJ9.WZ4_UtVvuVmOw4ofNMkiJw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 1.4,
    center: [21.6,7.6],
    hash: true
});

map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}));

map.on('load', function () {
    map.addSource('terrain-data', {
        type: 'vector',
        url: 'mapbox://amisha.wikidata'
    });
    map.addLayer({
        "id": "terrain-data",
        "type": "circle",
        "source": "terrain-data",
        "source-layer": "wikidata",
        "paint": {
            "circle-color": "#00008B"
        }
    });
});
