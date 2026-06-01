import csv
import json
import io
from fpdf import FPDF
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import WeatherSearch
import xml.etree.ElementTree as ET

router = APIRouter(prefix="/export", tags=["Data Export"])


# ── HELPER: Get all searches ──
def get_searches(db: Session):
    searches = db.query(WeatherSearch).all()
    if not searches:
        raise HTTPException(status_code=404, detail="No data to export")
    return searches


# ── EXPORT JSON ──
@router.get("/json")
def export_json(db: Session = Depends(get_db)):
    searches = get_searches(db)
    data = []
    for s in searches:
        data.append({
            "id": s.id,
            "location": s.location,
            "country": s.country,
            "temperature_c": s.temperature_c,
            "temperature_f": s.temperature_f,
            "condition": s.condition,
            "humidity": s.humidity,
            "wind_kph": s.wind_kph,
            "date_from": s.date_from,
            "date_to": s.date_to,
            "created_at": str(s.created_at),
        })
    return JSONResponse(content=data)


# ── EXPORT CSV ──
@router.get("/csv")
def export_csv(db: Session = Depends(get_db)):
    searches = get_searches(db)

    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        "ID", "Location", "Country", "Temp (C)", "Temp (F)",
        "Condition", "Humidity", "Wind (kph)", "Date From", "Date To", "Created At"
    ])

    # Rows
    for s in searches:
        writer.writerow([
            s.id, s.location, s.country, s.temperature_c, s.temperature_f,
            s.condition, s.humidity, s.wind_kph, s.date_from, s.date_to, s.created_at
        ])

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=weather_searches.csv"}
    )


# ── EXPORT PDF ──
@router.get("/pdf")
def export_pdf(db: Session = Depends(get_db)):
    searches = get_searches(db)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Weather Searches Report", ln=True, align="C")
    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 8, "PM Accelerator - Weather App by Wissem Ben Khalifa", ln=True, align="C")
    pdf.ln(5)

    for s in searches:
        pdf.set_font("Arial", "B", 11)
        pdf.cell(0, 8, f"{s.location}, {s.country}", ln=True)
        pdf.set_font("Arial", "", 10)
        pdf.cell(0, 6, f"Temperature: {s.temperature_c}C / {s.temperature_f}F", ln=True)
        pdf.cell(0, 6, f"Condition: {s.condition}", ln=True)
        pdf.cell(0, 6, f"Humidity: {s.humidity}%  |  Wind: {s.wind_kph} kph", ln=True)
        pdf.cell(0, 6, f"Date Range: {s.date_from} to {s.date_to}", ln=True)
        pdf.ln(4)

    pdf_output = pdf.output(dest="S").encode("latin-1")
    return StreamingResponse(
        io.BytesIO(pdf_output),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=weather_report.pdf"}
    )


# ── EXPORT MARKDOWN ──
@router.get("/markdown")
def export_markdown(db: Session = Depends(get_db)):
    searches = get_searches(db)

    md = "# Weather Searches Report\n"
    md += "**PM Accelerator - Weather App by Wissem Ben Khalifa**\n\n"
    md += "| ID | Location | Country | Temp C | Temp F | Condition | Humidity | Wind | Date From | Date To |\n"
    md += "|----|----------|---------|--------|--------|-----------|----------|------|-----------|--------|\n"

    for s in searches:
        md += f"| {s.id} | {s.location} | {s.country} | {s.temperature_c} | {s.temperature_f} | {s.condition} | {s.humidity}% | {s.wind_kph} kph | {s.date_from} | {s.date_to} |\n"

    return StreamingResponse(
        io.BytesIO(md.encode()),
        media_type="text/markdown",
        headers={"Content-Disposition": "attachment; filename=weather_report.md"}
    )
# ── EXPORT XML ──
@router.get("/xml")
def export_xml(db: Session = Depends(get_db)):
    searches = get_searches(db)

    root = ET.Element("WeatherSearches")
    root.set("generated_by", "Weather App by Wissem Ben Khalifa")
    root.set("company", "PM Accelerator")

    for s in searches:
        search_elem = ET.SubElement(root, "WeatherSearch")

        ET.SubElement(search_elem, "ID").text = str(s.id)
        ET.SubElement(search_elem, "Location").text = str(s.location)
        ET.SubElement(search_elem, "Country").text = str(s.country)
        ET.SubElement(search_elem, "TemperatureC").text = str(s.temperature_c)
        ET.SubElement(search_elem, "TemperatureF").text = str(s.temperature_f)
        ET.SubElement(search_elem, "Condition").text = str(s.condition)
        ET.SubElement(search_elem, "Humidity").text = str(s.humidity)
        ET.SubElement(search_elem, "WindKph").text = str(s.wind_kph)
        ET.SubElement(search_elem, "DateFrom").text = str(s.date_from)
        ET.SubElement(search_elem, "DateTo").text = str(s.date_to)
        ET.SubElement(search_elem, "CreatedAt").text = str(s.created_at)

    xml_str = ET.tostring(root, encoding="unicode", xml_declaration=False)
    xml_output = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str

    return StreamingResponse(
        io.BytesIO(xml_output.encode("utf-8")),
        media_type="application/xml",
        headers={"Content-Disposition": "attachment; filename=weather_report.xml"}
    )