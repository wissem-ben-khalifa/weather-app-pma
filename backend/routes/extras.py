import requests
import os
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/extras", tags=["Extra APIs"])
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
AIR_QUALITY_API_KEY = os.getenv("AIR_QUALITY_API_KEY")


# ── YOUTUBE VIDEOS ──
@router.get("/youtube")
def get_youtube_videos(location: str):
    try:
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "key": YOUTUBE_API_KEY,
                "q": f"{location} travel weather",
                "part": "snippet",
                "maxResults": 5,
                "type": "video",
            }
        )
        data = response.json()

        if "error" in data:
            raise HTTPException(status_code=400, detail=data["error"]["message"])

        videos = []
        for item in data.get("items", []):
            videos.append({
                "title": item["snippet"]["title"],
                "description": item["snippet"]["description"],
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "video_id": item["id"]["videoId"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "channel": item["snippet"]["channelTitle"],
            })

        return {"location": location, "videos": videos}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── GOOGLE MAPS ──
# ── MAPS (OpenStreetMap - Free, No API key needed) ──
@router.get("/maps")
def get_map(location: str):
    try:
        # Use Nominatim (OpenStreetMap) - completely free
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                "q": location,
                "format": "json",
                "limit": 1,
            },
            headers={
                "User-Agent": "WeatherApp/1.0"
            }
        )
        data = response.json()

        if not data:
            raise HTTPException(status_code=404, detail=f"Location '{location}' not found on maps")

        result = data[0]
        lat = float(result["lat"])
        lng = float(result["lon"])
        display_name = result["display_name"]

        return {
            "location": location,
            "formatted_address": display_name,
            "latitude": lat,
            "longitude": lng,
            "maps_url": f"https://www.openstreetmap.org/?mlat={lat}&mlon={lng}&zoom=12",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# ── AIR QUALITY ──
@router.get("/airquality")
def get_air_quality(location: str):
    try:
        response = requests.get(
            f"https://api.waqi.info/feed/{location}/",
            params={"token": AIR_QUALITY_API_KEY}
        )
        data = response.json()

        if data["status"] != "ok":
            raise HTTPException(
                status_code=404,
                detail=f"Air quality data not found for '{location}'"
            )

        aqi = data["data"]["aqi"]
        
        # AQI level description
        if aqi <= 50:
            level = "Good"
            color = "#48bb78"
            description = "Air quality is satisfactory and poses little or no risk."
        elif aqi <= 100:
            level = "Moderate"
            color = "#ecc94b"
            description = "Acceptable air quality. Sensitive people may experience minor effects."
        elif aqi <= 150:
            level = "Unhealthy for Sensitive Groups"
            color = "#ed8936"
            description = "Sensitive groups may experience health effects."
        elif aqi <= 200:
            level = "Unhealthy"
            color = "#fc8181"
            description = "Everyone may experience health effects."
        elif aqi <= 300:
            level = "Very Unhealthy"
            color = "#9f7aea"
            description = "Health alert: everyone may experience serious effects."
        else:
            level = "Hazardous"
            color = "#742a2a"
            description = "Emergency conditions. Everyone is affected."

        return {
            "location": location,
            "aqi": aqi,
            "level": level,
            "color": color,
            "description": description,
            "dominentpol": data["data"].get("dominentpol", "N/A"),
            "time": data["data"]["time"]["s"],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))