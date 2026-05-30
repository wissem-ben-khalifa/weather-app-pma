import requests
import os
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/extras", tags=["Extra APIs"])
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")


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