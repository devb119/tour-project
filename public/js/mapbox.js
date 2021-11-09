export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGV2YjExOSIsImEiOiJja3ZwNHV3dXAwcGF0MnVxdjZlcTVveXlpIn0.YgbQWa_2GCJ4wit1fmr37A';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/devb119/ckvp667hc3ksp14p8a0vz4tep',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 8,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add pop-up
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    // Extend map bound to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 200,
      right: 200,
    },
  });
};
