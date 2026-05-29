import requests
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import WeatherSearch
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/weather", tags=["Weather"])
API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = "http://api.weatherapi.com/v1"


# ── GET CURRENT WEATHER ──
@router.get("/current")
def get_current_weather(location: str, db: Session = Depends(get_db)):
    try:
        response = requests.get(
            f"{BASE_URL}/current.json",
            params={"key": API_KEY, "q": location, "aqi": "yes"}
        )
        data = response.json()

        if "error" in data:
            raise HTTPException(status_code=404, detail=data["error"]["message"])

        result = {
            "location": data["location"]["name"],
            "country": data["location"]["country"],
            "temperature_c": data["current"]["temp_c"],
            "temperature_f": data["current"]["temp_f"],
            "condition": data["current"]["condition"]["text"],
            "condition_icon": data["current"]["condition"]["icon"],
            "humidity": data["current"]["humidity"],
            "wind_kph": data["current"]["wind_kph"],
            "feels_like_c": data["current"]["feelslike_c"],
            "uv_index": data["current"]["uv"],
            "air_quality": data["current"].get("air_quality", {}),
        }

        # Auto save to database
        db_search = WeatherSearch(
            location=result["location"],
            country=result["country"],
            temperature_c=result["temperature_c"],
            temperature_f=result["temperature_f"],
            condition=result["condition"],
            humidity=result["humidity"],
            wind_kph=result["wind_kph"],
        )
        db.add(db_search)
        db.commit()

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── GET 5-DAY FORECAST ──
@router.get("/forecast")
def get_forecast(location: str, db: Session = Depends(get_db)):
    try:
        response = requests.get(
            f"{BASE_URL}/forecast.json",
            params={"key": API_KEY, "q": location, "days": 5}
        )
        data = response.json()

        if "error" in data:
            raise HTTPException(status_code=404, detail=data["error"]["message"])

        forecast_days = []
        for day in data["forecast"]["forecastday"]:
            forecast_days.append({
                "date": day["date"],
                "max_temp_c": day["day"]["maxtemp_c"],
                "min_temp_c": day["day"]["mintemp_c"],
                "max_temp_f": day["day"]["maxtemp_f"],
                "min_temp_f": day["day"]["mintemp_f"],
                "condition": day["day"]["condition"]["text"],
                "condition_icon": day["day"]["condition"]["icon"],
                "humidity": day["day"]["avghumidity"],
                "rain_chance": day["day"]["daily_chance_of_rain"],
            })

        return {
            "location": data["location"]["name"],
            "country": data["location"]["country"],
            "forecast": forecast_days
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))