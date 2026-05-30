from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import WeatherSearch
from pydantic import BaseModel
from typing import Optional
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/searches", tags=["CRUD - Weather Searches"])
API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = "http://api.weatherapi.com/v1"


# ── SCHEMAS ──
class WeatherSearchCreate(BaseModel):
    location: str
    date_from: str
    date_to: str


class WeatherSearchUpdate(BaseModel):
    location: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None


# ── VALIDATE LOCATION ──
def validate_location(location: str):
    response = requests.get(
        f"{BASE_URL}/current.json",
        params={"key": API_KEY, "q": location}
    )
    data = response.json()
    if "error" in data:
        raise HTTPException(status_code=404, detail=f"Location '{location}' not found")
    return data


# ── VALIDATE DATE RANGE ──
def validate_dates(date_from: str, date_to: str):
    from datetime import datetime
    try:
        d1 = datetime.strptime(date_from, "%Y-%m-%d")
        d2 = datetime.strptime(date_to, "%Y-%m-%d")
        if d2 < d1:
            raise HTTPException(
                status_code=400,
                detail="date_to must be after date_from"
            )
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD"
        )


# ── CREATE ──
@router.post("/")
def create_search(data: WeatherSearchCreate, db: Session = Depends(get_db)):
    # Validate dates
    validate_dates(data.date_from, data.date_to)

    # Validate location and get weather
    weather_data = validate_location(data.location)

    search = WeatherSearch(
        location=weather_data["location"]["name"],
        country=weather_data["location"]["country"],
        temperature_c=weather_data["current"]["temp_c"],
        temperature_f=weather_data["current"]["temp_f"],
        condition=weather_data["current"]["condition"]["text"],
        humidity=weather_data["current"]["humidity"],
        wind_kph=weather_data["current"]["wind_kph"],
        date_from=data.date_from,
        date_to=data.date_to,
    )

    db.add(search)
    db.commit()
    db.refresh(search)
    return {"message": "Search saved successfully", "data": search}


# ── READ ALL ──
@router.get("/")
def get_all_searches(db: Session = Depends(get_db)):
    searches = db.query(WeatherSearch).all()
    return searches


# ── READ ONE ──
@router.get("/{search_id}")
def get_search(search_id: int, db: Session = Depends(get_db)):
    search = db.query(WeatherSearch).filter(WeatherSearch.id == search_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Search not found")
    return search


# ── UPDATE ──
@router.put("/{search_id}")
def update_search(search_id: int, data: WeatherSearchUpdate, db: Session = Depends(get_db)):
    search = db.query(WeatherSearch).filter(WeatherSearch.id == search_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Search not found")

    if data.location:
        weather_data = validate_location(data.location)
        search.location = weather_data["location"]["name"]
        search.country = weather_data["location"]["country"]
        search.temperature_c = weather_data["current"]["temp_c"]
        search.temperature_f = weather_data["current"]["temp_f"]
        search.condition = weather_data["current"]["condition"]["text"]
        search.humidity = weather_data["current"]["humidity"]
        search.wind_kph = weather_data["current"]["wind_kph"]

    if data.date_from:
        search.date_from = data.date_from
    if data.date_to:
        search.date_to = data.date_to

    if data.date_from and data.date_to:
        validate_dates(data.date_from, data.date_to)

    db.commit()
    db.refresh(search)
    return {"message": "Search updated successfully", "data": search}


# ── DELETE ──
@router.delete("/{search_id}")
def delete_search(search_id: int, db: Session = Depends(get_db)):
    search = db.query(WeatherSearch).filter(WeatherSearch.id == search_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Search not found")

    db.delete(search)
    db.commit()
    return {"message": f"Search {search_id} deleted successfully"}