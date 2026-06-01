# Weather App — PM Accelerator Technical Assessment

**Built by Wissem Ben Khalifa**

PM Accelerator is the world's most advanced AI product manager training program, helping professionals master product management through real-world AI projects.

---

## Overview

A full-stack weather application built with React (frontend) and FastAPI (backend), featuring real-time weather data, 5-day forecasts, interactive maps, YouTube videos, CRUD operations, and data export capabilities.

---

## Tech Stack

**Frontend:**
- React.js
- Leaflet / OpenStreetMap
- Axios

**Backend:**
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy
- fpdf2

**APIs:**
- WeatherAPI.com — current weather & forecast
- YouTube Data API v3 — location videos
- OpenStreetMap Nominatim — maps & geocoding
- AQICN (World Air Quality Index API) — real-time air quality index (AQI)

> Air quality data is provided by the World Air Quality Index (WAQI) project via aqicn.org.

---

## Features

- Search weather by city, zip code, GPS coordinates, or landmark
- Get current weather with temperature, humidity, wind, UV index
- 5-day forecast with icons
- Interactive map with OpenStreetMap
- YouTube videos about the location
- CRUD operations — save, view, edit, delete searches
- Export data as JSON, CSV, xml, PDF, Markdown
- Responsive design for all screen sizes
- Error handling for invalid locations and API failures
- Get weather by current GPS location
- Real-time air quality index (AQI) with health levels and pollutant data

---

## How to Run

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/weatherdb
WEATHER_API_KEY=your_weatherapi_key
YOUTUBE_API_KEY=your_google_api_key
AIR_QUALITY_API_KEY=your_air_quality_api_key


Create the database:
```bash
psql -U postgres
CREATE DATABASE weatherdb;
\q
```

Run the backend:
```bash
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`
API Docs at: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## Project Structure

```text
weather-app/
├── backend/
├── frontend/
└── README.md
```

### Backend
- `routes/weather.py` – Weather API endpoints
- `routes/crud.py` – CRUD operations
- `routes/extras.py` – YouTube and Maps integration
- `routes/export.py` – Data export endpoints

### Frontend
- `components/` – React UI components
- `assets/icons/` – Weather icons
- `api.js` – API communication layer

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /weather/current | Get current weather |
| GET | /weather/forecast | Get 5-day forecast |
| POST | /searches/ | Save a search |
| GET | /searches/ | Get all searches |
| GET | /searches/{id} | Get one search |
| PUT | /searches/{id} | Update a search |
| DELETE | /searches/{id} | Delete a search |
| GET | /extras/youtube | Get YouTube videos |
| GET | /extras/maps | Get map data |
| GET | /export/json | Export as JSON |
| GET | /export/csv | Export as CSV |
| GET | /export/pdf | Export as PDF |
| GET | /export/markdown | Export as Markdown |
| GET | /extras/airquality | Get air quality index (AQI) for a location |