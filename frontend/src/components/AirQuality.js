import React from 'react';

function AirQuality({ airQuality }) {
  return (
    <div className="air-quality card">
      <h2>Air Quality — {airQuality.location}</h2>
      <p className="aqi-time">Last updated: {airQuality.time}</p>

      <div className="aqi-main">
        <div
          className="aqi-circle"
          style={{ background: airQuality.color }}
        >
          <span className="aqi-number">{airQuality.aqi}</span>
          <span className="aqi-label">AQI</span>
        </div>
        <div className="aqi-info">
          <h3 style={{ color: airQuality.color }}>{airQuality.level}</h3>
          <p className="aqi-description">{airQuality.description}</p>
          <p className="aqi-pollutant">
            Main pollutant: <strong>{airQuality.dominentpol.toUpperCase()}</strong>
          </p>
        </div>
      </div>

      <div className="aqi-scale">
        <h4>AQI Scale</h4>
        <div className="scale-bars">
          <div className="scale-item">
            <div className="scale-color" style={{background: '#48bb78'}}></div>
            <span>0-50 Good</span>
          </div>
          <div className="scale-item">
            <div className="scale-color" style={{background: '#ecc94b'}}></div>
            <span>51-100 Moderate</span>
          </div>
          <div className="scale-item">
            <div className="scale-color" style={{background: '#ed8936'}}></div>
            <span>101-150 Unhealthy*</span>
          </div>
          <div className="scale-item">
            <div className="scale-color" style={{background: '#fc8181'}}></div>
            <span>151-200 Unhealthy</span>
          </div>
          <div className="scale-item">
            <div className="scale-color" style={{background: '#9f7aea'}}></div>
            <span>201-300 Very Unhealthy</span>
          </div>
          <div className="scale-item">
            <div className="scale-color" style={{background: '#742a2a'}}></div>
            <span>300+ Hazardous</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirQuality;