import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Set up a default icon for markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png"
});

function CityMap() {
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  const getCityCoordinates = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
      } else {
        alert("City not found");
      }
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
      alert("Error finding city");
    }
  };

  return (
    <div>
      <h1>Find City Location</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={getCityCoordinates}>Find City</button>

      {coordinates && (
        <MapContainer
          center={[coordinates.lat, coordinates.lon]}
          zoom={13}
          style={{ height: "500px", width: "100%", marginTop: "20px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[coordinates.lat, coordinates.lon]}>
            <Popup>{city}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default CityMap;
