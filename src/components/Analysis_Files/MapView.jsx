import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Custom component to fit bounds
const FitBounds = ({ geoData }) => {
  const map = useMap();

  useEffect(() => {
    if (geoData) {
      const geoJsonLayer = L.geoJSON(geoData);
      map.fitBounds(geoJsonLayer.getBounds());
    }
  }, [geoData, map]);

  return null;
};

const MapView = () => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch('/public/data/sindhudurg_district_talukas_geojson 1.geojson') 
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: 'white' }}>
      <MapContainer center={[20, 78]} zoom={4} style={{ height: '100%', width: '100%' }}>
        {geoData && (
          <>
            <GeoJSON
              data={geoData}
              style={{
                color: 'black',        // Border color
                weight: 1.5,           // Border thickness
                fillColor: 'white',    // Inside color
                fillOpacity: 1         // Opacity of inside fill
              }}
            />
            <FitBounds geoData={geoData} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
