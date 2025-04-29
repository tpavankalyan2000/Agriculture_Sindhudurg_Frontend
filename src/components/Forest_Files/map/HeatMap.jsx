import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import geoJSONData from './sindhudurg_villages.json';
import { API_URL_8 } from '../../../config';
const HeatMap = ({ filters, speciesOptions }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const legendRef = useRef(null);

  const [villageCounts, setVillageCounts] = useState({});

  const formatDateForQuery = (date) => date?.toISOString().split('T')[0];

  const getColor = (count) => {
    if (count > 500) return '#7b2cbf';  // Deep Purple
    if (count > 100) return '#5f0f40';  // Maroon Purple
    if (count > 50) return '#9a031e';   // Vivid Red
    if (count > 20) return '#fb5607';   // Strong Orange
    if (count > 0) return '#ffbe0b';    // Bright Yellow
    return '#d0f4de'; // Very light green for 0
  };

  const fetchVillageCounts = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.selectedSpecies.length > 0) {
        const selectedSpeciesNames = speciesOptions
          .filter(species => filters.selectedSpecies.includes(species.id))
          .map(species => species.common_name);

        selectedSpeciesNames.forEach(name => params.append('species_names', name));
      }

      if (filters.dateRange[0]) {
        params.append('start_date', formatDateForQuery(filters.dateRange[0]));
      }
      if (filters.dateRange[1]) {
        params.append('end_date', formatDateForQuery(filters.dateRange[1]));
      }

      const res = await axios.get(`${API_URL_8}/village-incident-counts?${params.toString()}`);
      setVillageCounts(res.data.village_counts);
    } catch (error) {
      console.error('Error fetching village counts:', error);
    }
  };

  useEffect(() => {
    fetchVillageCounts();
  }, [filters]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [16.0055, 73.5721], // Sindhudurg center
        minZoom: 9.5,
        maxZoom: 9.5,
        zoomControl: false,
        attributionControl: false
      });
    }

    // Clear previous layer
    if (layerRef.current) {
      mapRef.current.removeLayer(layerRef.current);
    }

    // Add new GeoJSON layer
    layerRef.current = L.geoJSON(geoJSONData, {
      style: feature => {
        const villageName = feature.properties.Village || feature.properties.village || feature.properties.name;
        const count = villageCounts[villageName] || 0;
        return {
          color: '#000',
          weight: 1,
          opacity: 1,
          fillColor: getColor(count),
          fillOpacity: 0.8
        };
      },
      onEachFeature: (feature, layer) => {
        const villageName = feature.properties.Village || feature.properties.village || feature.properties.name;
        const count = villageCounts[villageName] || 0;
        layer.bindPopup(`<strong>${villageName}</strong><br/>Incidents: ${count}`);
      }
    }).addTo(mapRef.current);

    // Fit bounds
    const bounds = layerRef.current.getBounds();
    mapRef.current.fitBounds(bounds);
    mapRef.current.setMaxBounds(bounds);

    // Add Legend
    if (!legendRef.current) {
      legendRef.current = L.control({ position: 'topright' });

      legendRef.current.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 20, 50, 100, 500];

        div.innerHTML = grades.map((from, i) => {
          const to = grades[i + 1];
          return `
            <i style="background:${getColor(from)}; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> 
            ${from}${to ? `-${to - 1}` : '+'}
          `;
        }).join('<br>');

        return div;
      };

      legendRef.current.addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current && layerRef.current) {
        mapRef.current.removeLayer(layerRef.current);
      }
      if (legendRef.current) {
        legendRef.current.remove();
        legendRef.current = null;
      }
    };
  }, [villageCounts]);

  // Heading logic
  const isFilterActive = filters.selectedSpecies.length > 0 || filters.selectedDamageClasses.length > 0 || filters.dateRange.some(d => d !== null);
  const headingText = isFilterActive ? "Filtered Map View (Selected Species/Time)" : "Overall Incident Map";

  return (
    <>
      <h1 className="text-xl font-semibold mb-2">{headingText}</h1>
      <div className="leaflet-map-container" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
        <div 
          ref={mapContainerRef} 
          className="leaflet-map"
          style={{ height: '100vh', background: '#fff' }}
        ></div>
      </div>
    </>
  );
};

export default HeatMap;
