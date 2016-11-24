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

    map.addSource('wikidata', {
        type: 'vector',
        url: 'mapbox://amisha.wikidata'
    });
    map.addLayer({
        "id": "wikidata-nodes",
        "type": "circle",
        "source": "wikidata",
        "source-layer": "wikidata",
        "paint": {
            "circle-color": {
                "property": 'distance',
                "stops": [
                    [ 0, '#fbb03b'],
                    [ 0.1, '#223b53'],
                    [ 1, '#e55e5e'],
                    [ 5, '#3bb2d0'],
                    [ 10, '#ccc'],
                    [1000, '']]
            }
        }
    });


});
