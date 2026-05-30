import React, { useState } from 'react';
import './App.css';
import WeatherSearch from './components/WeatherSearch';
import WeatherDisplay from './components/WeatherDisplay';
import Forecast from './components/Forecast';
import SavedSearches from './components/SavedSearches';
import MapDisplay from './components/MapDisplay';
import YoutubeVideos from './components/YoutubeVideos';
import ExportButtons from './components/ExportButtons';

// Icons
import sunIcon from './assets/icons/sun.png';
import calendarIcon from './assets/icons/calendar.png';
import mapIcon from './assets/icons/map.png';
import videoIcon from './assets/icons/video.png';
import saveIcon from './assets/icons/save.png';
import exportIcon from './assets/icons/export.png';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('weather');

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <h1>Weather App</h1>
        <p>By Wissem Ben Khalifa</p>
        <p className="pm-description">
          PM Accelerator is the world's most advanced AI product manager training program,
          helping professionals master product management through real-world AI projects.
        </p>
      </header>

      {/* SEARCH */}
      <WeatherSearch
        setWeather={setWeather}
        setForecast={setForecast}
        setMapData={setMapData}
        setVideos={setVideos}
        setError={setError}
        setLoading={setLoading}
      />

      {/* ERROR */}
      {error && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="loading">
          <p>Loading weather data...</p>
        </div>
      )}

      {/* TABS */}
      {weather && (
        <div className="tabs">
          <button
            className={activeTab === 'weather' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('weather')}
          >
            <img src={sunIcon} alt="weather" className="tab-icon" />
            Weather
          </button>
          <button
            className={activeTab === 'forecast' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('forecast')}
          >
            <img src={calendarIcon} alt="forecast" className="tab-icon" />
            5-Day Forecast
          </button>
          <button
            className={activeTab === 'map' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('map')}
          >
            <img src={mapIcon} alt="map" className="tab-icon" />
            Map
          </button>
          <button
            className={activeTab === 'videos' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('videos')}
          >
            <img src={videoIcon} alt="videos" className="tab-icon" />
            Videos
          </button>
          <button
            className={activeTab === 'saved' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('saved')}
          >
            <img src={saveIcon} alt="saved" className="tab-icon" />
            Saved Searches
          </button>
          <button
            className={activeTab === 'export' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('export')}
          >
            <img src={exportIcon} alt="export" className="tab-icon" />
            Export
          </button>
        </div>
      )}

      {/* TAB CONTENT */}
      <div className="content">
        {activeTab === 'weather' && weather && <WeatherDisplay weather={weather} />}
        {activeTab === 'forecast' && forecast && <Forecast forecast={forecast} />}
        {activeTab === 'map' && mapData && <MapDisplay mapData={mapData} />}
        {activeTab === 'videos' && videos && <YoutubeVideos videos={videos} />}
        {activeTab === 'saved' && <SavedSearches />}
        {activeTab === 'export' && <ExportButtons />}
      </div>
    </div>
  );
}

export default App;