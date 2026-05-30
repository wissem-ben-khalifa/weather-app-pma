from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routes import weather, crud, extras

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Weather App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router)
app.include_router(crud.router)
app.include_router(extras.router)

@app.get("/")
def root():
    return {"message": "Weather App API is running!"}