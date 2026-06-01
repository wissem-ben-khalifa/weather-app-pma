import React from 'react';

function Forecast({ forecast }) {
  return (
    <div className="forecast card">
      <h2>5-Day Forecast — {forecast.location}, {forecast.country}</h2>
      <div className="forecast-grid">
        {forecast.forecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <p className="forecast-date">{day.date}</p>
            <img
              src={`https:${day.condition_icon}`}
              alt={day.condition}
              className="forecast-icon"
            />
            <p className="forecast-condition">{day.condition}</p>
            <div className="forecast-temps">
              <span className="temp-max">{day.max_temp_c}°C</span>
              <span className="temp-min">{day.min_temp_c}°C</span>
            </div>
            <div className="forecast-details">
              <p>Humidity: {day.humidity}%</p>
              <p>Rain: {day.rain_chance}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;