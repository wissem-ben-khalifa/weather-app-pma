import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon bug
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapDisplay({ mapData }) {
  const position = [mapData.latitude, mapData.longitude];

  return (
    
    <div className="map-container card">
      <h2>Map — {mapData.location}</h2>
      <p className="map-address">{mapData.formatted_address}</p>
      <div className="map-coords">
        <span>Lat: {mapData.latitude.toFixed(4)}</span>
        <span>Lng: {mapData.longitude.toFixed(4)}</span>
        <a
          href={mapData.maps_url}
          target="_blank"
          rel="noreferrer"
          className="osm-link"
        >
          Open in OpenStreetMap
        </a>
      </div>

      <div className="leaflet-map">
        <MapContainer
          center={position}
          zoom={12}
          style={{ height: '400px', width: '100%', borderRadius: '10px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={position}>
            <Popup>
              {mapData.location} <br />
              {mapData.formatted_address}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default MapDisplay;