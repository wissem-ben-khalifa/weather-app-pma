import React, { useState } from 'react';
import { createSearch } from '../api';
import thermometerIcon from '../assets/icons/thermometer.png';
import humidityIcon from '../assets/icons/humidity.png';
import windIcon from '../assets/icons/wind.png';
import locationIcon from '../assets/icons/location.png';

function WeatherDisplay({ weather }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    if (!dateFrom || !dateTo) {
      setSaveError('Please select both dates');
      return;
    }
    try {
      await createSearch({
        location: weather.location,
        date_from: dateFrom,
        date_to: dateTo,
      });
      setSaveMsg('Search saved successfully!');
      setSaveError('');
    } catch (err) {
      setSaveError(err.response?.data?.detail || 'Error saving search');
      setSaveMsg('');
    }
  };

  return (
    <div className="weather-display card">

      {/* LOCATION */}
      <div className="weather-header">
        <img src={locationIcon} alt="location" className="weather-icon" />
        <h2>{weather.location}, {weather.country}</h2>
      </div>

      {/* CONDITION */}
      <div className="weather-condition">
        <img
          src={`https:${weather.condition_icon}`}
          alt={weather.condition}
          className="condition-icon"
        />
        <p className="condition-text">{weather.condition}</p>
      </div>

      {/* STATS */}
      <div className="weather-stats">
        <div className="stat-card">
          <img src={thermometerIcon} alt="temp" className="stat-icon" />
          <div>
            <p className="stat-value">{weather.temperature_c}°C</p>
            <p className="stat-value">{weather.temperature_f}°F</p>
            <p className="stat-label">Temperature</p>
          </div>
        </div>

        <div className="stat-card">
          <img src={thermometerIcon} alt="feels" className="stat-icon" />
          <div>
            <p className="stat-value">{weather.feels_like_c}°C</p>
            <p className="stat-label">Feels Like</p>
          </div>
        </div>

        <div className="stat-card">
          <img src={humidityIcon} alt="humidity" className="stat-icon" />
          <div>
            <p className="stat-value">{weather.humidity}%</p>
            <p className="stat-label">Humidity</p>
          </div>
        </div>

        <div className="stat-card">
          <img src={windIcon} alt="wind" className="stat-icon" />
          <div>
            <p className="stat-value">{weather.wind_kph} kph</p>
            <p className="stat-label">Wind Speed</p>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="stat-value">{weather.uv_index}</p>
            <p className="stat-label">UV Index</p>
          </div>
        </div>
      </div>

      {/* SAVE SECTION */}
      <div className="save-section">
        <h3>Save This Search</h3>
        <div className="date-inputs">
          <div className="date-field">
            <label>Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-field">
            <label>Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="date-input"
            />
          </div>
          <button onClick={handleSave} className="save-btn">
            Save Search
          </button>
        </div>
        {saveMsg && <p className="success-msg">{saveMsg}</p>}
        {saveError && <p className="error-msg">{saveError}</p>}
      </div>
    </div>
  );
}

export default WeatherDisplay;