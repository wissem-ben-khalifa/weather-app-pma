from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class WeatherSearch(Base):
    __tablename__ = "weather_searches"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, nullable=False)
    country = Column(String)
    temperature_c = Column(Float)
    temperature_f = Column(Float)
    condition = Column(String)
    humidity = Column(Integer)
    wind_kph = Column(Float)
    date_from = Column(String)
    date_to = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())