const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGV2YjExOSIsImEiOiJja3ZwNHV3dXAwcGF0MnVxdjZlcTVveXlpIn0.YgbQWa_2GCJ4wit1fmr37A';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/devb119/ckvp667hc3ksp14p8a0vz4tep',
  center: [-118.113491, 34.111745],
  zoom: 8,
  interactive: false,
});
