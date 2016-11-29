// mapbox-gl-live: Live tools to add interactivity to your Mapbox GL map
//  inspector: Explore the map data by inspecting features with the mouse

var xtend = require('xtend');
var centroid = require('turf-centroid');

defaultOpts = {
    layers: ['building'],
    on: 'click'
}

var Live = {

    // Inspect map layers on mouse interactivity
    inspector: function(map, opts) {

        opts = xtend(defaultOpts, opts);

        // Query features on interaction with the layers
        map.on(opts.on, function(e) {
            var features = map.queryRenderedFeatures(e.point, {layers: opts.layers});

            if (!features.length) {
                return;
            }

            var feature = features[0];

            var lngLat1,
                lngLat2;

            // Fetch the Wikidata entity for the latest properties
            $.getJSON("https://www.wikidata.org/w/api.php?action=wbgetentities&ids=" + feature.properties.wikidata + "&format=json&callback=?", function(data) {
                if (data["entities"]) {

                    var latitude = data["entities"][feature.properties.wikidata]["claims"]["P625"][0]["mainsnak"]["datavalue"]["value"]["latitude"];
                    var longitude = data["entities"][feature.properties.wikidata]["claims"]["P625"][0]["mainsnak"]["datavalue"]["value"]["longitude"];
                    lngLat1 = new mapboxgl.LngLat(longitude, latitude);
                    lngLat2 = new mapboxgl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);
                    var distance = getDistance(lngLat1, lngLat2);
                    var modified = false;
                    if (distance !== feature.properties.distance && Math.abs(distance - feature.properties.distance) > 0.1) {
                        modified = true;
                        feature.properties.distance = distance;
                    }

                    var popupHTML = populateTable(feature, modified);

                    var popup = new mapboxgl.Popup().setLngLat(centroid(feature).geometry.coordinates).setHTML(popupHTML).addTo(map);
                }
            });

        });

        // Change the mouse to a pointer on hovering over inspectable features
        map.on('mousemove', function(e) {
            var features = map.queryRenderedFeatures(e.point, {layers: opts.layers});
            map.getCanvas().style.cursor = (features.length)
                ? 'pointer'
                : '';
        });

    }
}

function populateTable(feature, modified) {
    // Populate the popup and set its coordinates
    // based on the feature found.

    var popupHTML = "<h3>" + feature.properties.name + "</h3>";
    popupHTML += "<a href='https://www.wikidata.org/wiki/" + feature.properties.wikidata + "'>Wikidata</a><br>";
    popupHTML += "<a href='" + nominatimLink(feature.properties.name, feature.geometry.coordinates) + "'>OSM Search</a><br>";

    popupHTML += "<table style='table-layout:fixed'>";

    if (modified) {
        popupHTML += "<h4>Modified on wikidata</h4>";
    }

    for (property in feature.properties) {
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
        a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos((lnglat2.lng - lnglat1.lng) * rad);

    const maxMeters = R * Math.acos(Math.min(a, 1));
    return maxMeters / 1000;
}

// Generate a nominatim search link for a feature name
function nominatimLink(name, coordinates) {

    const NOMINATIM_BASE = 'http://nominatim.openstreetmap.org/search.php?q=';

    // Limit search to the vicinity of the given coordinates
    try {

        var left = coordinates[0] - 1;
        var top = coordinates[1] - 1;
        var right = coordinates[0] + 1;
        var bottom = coordinates[1] + 1;

        var NOMINATIM_OPTS = name + "&polygon=1&bounded=1&viewbox=" + left + "%2C" + top + "%2C" + right + "%2C" + bottom

    } catch (e) {
        var NOMINATIM_OPTS = name
    }

    return NOMINATIM_BASE + NOMINATIM_OPTS;

}

// Export module
module.exports = Live;
