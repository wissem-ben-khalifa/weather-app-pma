import React, { useState } from 'react';
import { getCurrentWeather, getForecast, getMap, getYoutubeVideos, getAirQuality } from '../api';
import searchIcon from '../assets/icons/search.png';
import locationIcon from '../assets/icons/location.png';

function WeatherSearch({
  setWeather, setForecast, setMapData,
  setVideos, setError, setLoading, setAirQuality
}) {
  const [location, setLocation] = useState('');

const handleSearch = async () => {
  if (!location.trim()) {
    setError('Please enter a location');
    return;
  }

  setLoading(true);
  setError(null);

  try {
  // First get weather (source of truth)
  const weatherRes = await getCurrentWeather(location);

  // Clean location (avoid "City, Country" issues for other APIs)
  const baseLocation = weatherRes.data.location.split(',')[0].trim();

  const [forecastRes, mapRes, videosRes, airRes] = await Promise.all([
    getForecast(location),
    getMap(baseLocation),
    getYoutubeVideos(location),
    getAirQuality(baseLocation).catch(() => null),
  ]);

  setWeather(weatherRes.data);
  setForecast(forecastRes.data);
  setMapData(mapRes.data);
  setVideos(videosRes.data);
  setAirQuality(airRes ? airRes.data : null);

} catch (err) {
  setError(
    err.response?.data?.detail || 'Location not found. Please try again.'
  );
  setWeather(null);
  setForecast(null);
  setMapData(null);
  setVideos(null);
} finally {
  setLoading(false);
}};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleGetLocation = () => {
  if (!navigator.geolocation) {
    setError('Geolocation is not supported by your browser');
    return;
  }

  setLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const coords = `${latitude},${longitude}`;

        const [weatherRes, forecastRes, mapRes, videosRes, airRes] =
          await Promise.all([
            getCurrentWeather(coords),
            getForecast(coords),
            getMap(coords),
            getYoutubeVideos(coords),
            getAirQuality(coords).catch(() => null),
          ]);

        setWeather(weatherRes.data);
        setForecast(forecastRes.data);
        setMapData(mapRes.data);
        setVideos(videosRes.data);
        setAirQuality(airRes ? airRes.data : null);
        setError(null);

      } catch (err) {
        setError('Could not get weather for your location');
      } finally {
        setLoading(false);
      }
    },
    () => {
      setError('Unable to retrieve your location');
      setLoading(false);
    }
  );
};

  return (
    <div className="search-container card">
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city, zip code, coordinates or landmark..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          <img src={searchIcon} alt="search" className="btn-icon" />
          Search
        </button>
        <button onClick={handleGetLocation} className="location-btn">
          <img src={locationIcon} alt="location" className="btn-icon" />
          My Location
        </button>
      </div>
    </div>
  );
}

export default WeatherSearch;