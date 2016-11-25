### This script compares the location of the features having wikidata tags in OSM 
### with that of records in wikidata.org database and find out the corresponding 
### distance for each one of the feature. The distance can be used to validate the 
### osm features as well as wikidata tag location. The greater the distance, higher 
### the probability of incorrectness of either one of them.

import json
import shapely.geometry
import psycopg2
from geopy.distance import vincenty


### The database having the wikidata entries with the coordinates
conn = psycopg2.connect("dbname=wikidata user=sanjaybhangar")

cur = conn.cursor()

### The json dump of features having wikidata tags from osm planet 
fr = open('wikidata_planet.json')

fw = open('distance_wikidata_planet.geojson', 'w')

for line in fr:
    wikidata = json.loads(line)
    wiki_id = wikidata['properties']['wikidata']
    cur.execute("SELECT ST_AsGeojson(ST_Transform(geom, 4326)) from mb_wikidata WHERE qid = '%s'" % (wiki_id))
    x = cur.fetchone()
    if x is not None:
        geom_geojson = shapely.geometry.shape(wikidata["geometry"])
        geom_db = shapely.geometry.shape(json.loads(x[0]))
        centroid_geojson = geom_geojson.centroid
        centroid_db = geom_db.centroid
        distance = vincenty((centroid_geojson.x,centroid_geojson.y),(centroid_db.x, centroid_db.y)).km
        wikidata['properties']['distance'] = distance
        wikidata['geometry']['type'] = 'Point'
        wikidata['geometry']['coordinates'] = [centroid_geojson.x, centroid_geojson.y]
        fw.write(json.dumps(wikidata) + '\n')

fr.close()
fw.close()
cur.close()
conn.close()