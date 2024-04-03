// Init map
var map = L.map('map').setView([21.0285, 105.8542], 8);

$('input[type=radio][name=location]').change(function () {
  var lat = $(this).data('lat');
  var lng = $(this).data('lng');
  map.setView([lat, lng], 8);
  var circleMarker = L.circleMarker([lat, lng], {
    color: '#03fc17',
    fillColor: '#03fc17',
    fillOpacity: 1,
    radius: 5
  }).addTo(map).bindPopup($(this).closest('tr').find('.nameCity').text()).openPopup();
});


var $map = $('#map');
const cities = JSON.parse($map.attr('cities'));
console.log(cities);
// add tile map
L.tileLayer('https://maps.vietmap.vn/api/tm/{z}/{x}/{y}?apikey=1b6ea57cdf04fbc8ef64e7419aac8237e52a528e47b9c644', {
  maxZoom: 19,
}).addTo(map);


cities.map(e => {
  var latitude = e.position.lat;
  var longitude = e.position.lng;

  let circleMarker = L.circleMarker([latitude, longitude], {
    color: '#03fc17',
    fillColor: '#03fc17',
    fillOpacity: 1,
    radius: 5
  }).addTo(map).bindPopup(e.title);

  var geoJSONLayer = null;

  circleMarker.on('click', function (event) {
    var nameValue = e.title;
    nameValue = nameValue.replace(/\s/g, '');
    var latitudeValue = e.position.lat;
    var longitudeValue = e.position.lng;
    // Tạo URL của API
    var apiUrlMaker = 'https://maps.vietmap.vn/api/search/v3?apikey=1b6ea57cdf04fbc8ef64e7419aac8237e52a528e47b9c644&text=' + nameValue + '&focus=' + latitudeValue + ',' + longitudeValue + '';
    console.log(apiUrlMaker);

    fetch(apiUrlMaker)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        var id = data[3].boundaries[2].id;
        console.log(id)
        var apiUrl = `https://maps.vietmap.vn/api/boundaries/v3/info/${id}?apikey=1b6ea57cdf04fbc8ef64e7419aac8237e52a528e47b9c644`;

        if (geoJSONLayer !== null) {
          map.removeLayer(geoJSONLayer);
        }

        // Fetch API
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            if (data && data.geo_wkt) {
              var wktString = data.geo_wkt;
              var coordinates = parseWKTToCoordinates(wktString);
              let dataPolygon = {
                "type": "FeatureCollection",
                "features": [
                  {
                    "type": "Feature",
                    "properties": {
                      color: 'blue'
                    },
                    "geometry": {
                      "coordinates": coordinates,
                      "type": "Polygon"
                    }
                  }
                ]
              };
              L.geoJSON(dataPolygon, {
                style: function (feature) {
                  return { color: feature.properties.color };
                }
              }).bindPopup(function (layer) {
                return layer.feature.properties.description;
              }).addTo(map);
            } else {
              console.error('Error fetching data: geo_wkt not found or invalid.');
            }
          })
          .catch(error => console.error('Error fetching data:', error));

        function parseWKTToCoordinates(wktString) {
          var coordinatesString = wktString.match(/\(\(([^()]+)\)\)/)[1];
          var pairs = coordinatesString.split(',');
          var coordinates = pairs.map(pair => {
            var coords = pair.trim().split(' ');
            return [parseFloat(coords[0]), parseFloat(coords[1])];
          })
          return [coordinates];
        }
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  });
})




