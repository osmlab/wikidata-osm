# wikidata-osm
Apps, tools and scripts to work with Wikidata items from OpenStreetMap

## Distance Visualizer

![new3](https://cloud.githubusercontent.com/assets/126868/22975383/90cadae6-f3ac-11e6-99aa-7c3b1254129b.gif)

Use [the distance visualizer](https://osmlab.github.io/wikidata-osm/) to visualize the distance between the OpenStreetMap feature with the Wikidata tag, and the corresponsing coordinate on the Wikidata database. Larger markers indicate a larger distance between the matched features.

### Interpreting large match distances

A large match distance between the mapped feature and WIkidata location could be due to one of the following cases:

**Valid**
- Large natural features like oceans or continents that do not have a definied point location can be 1000kms apart. [Example](https://osmlab.github.io/wikidata-osm/#3.83/27.72/-172.05)
- Large administrative area features like countries, states and provinces hat do not have a definied point location can be 100kms apart. [Example](https://osmlab.github.io/wikidata-osm/#6.74/15.736/45.964)

**Inappropriately tagged on OpenStreetMap**
- A Wikidata tag was added to multiple OSM features that describe a single object like ways of a river instead of the river relation. [Example](https://osmlab.github.io/wikidata-osm/#9.34/40.6163/-123.6054)

**Incorrect Wikidata tag on OpenStreetMap**
- An incorrect Wikidata tag of a similiarly named feature has been added to OSM. [Example](https://osmlab.github.io/wikidata-osm/#12.74/16.8309/75.7144)

**Incorrect location on Wikidata**
- The Wikidata entry of the feature has an incorrect location. [Example](https://osmlab.github.io/wikidata-osm/#12.85/30.2919/73.0486)
