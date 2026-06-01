import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

// ── WEATHER ──
export const getCurrentWeather = (location) =>
  api.get(`/weather/current?location=${location}`);

export const getForecast = (location) =>
  api.get(`/weather/forecast?location=${location}`);

// ── EXTRAS ──
export const getMap = (location) =>
  api.get(`/extras/maps?location=${location}`);

export const getYoutubeVideos = (location) =>
  api.get(`/extras/youtube?location=${location}`);

// ── CRUD ──
export const createSearch = (data) =>
  api.post('/searches/', data);

export const getAllSearches = () =>
  api.get('/searches/');

export const updateSearch = (id, data) =>
  api.put(`/searches/${id}`, data);

export const deleteSearch = (id) =>
  api.delete(`/searches/${id}`);

// ── EXPORT ──
export const exportJSON = () =>
  api.get('/export/json');

export const exportCSV = () =>
  api.get('/export/csv', { responseType: 'blob' });

export const exportPDF = () =>
  api.get('/export/pdf', { responseType: 'blob' });

export const exportMarkdown = () =>
  api.get('/export/markdown', { responseType: 'blob' });

export const exportXML = () =>
  api.get('/export/xml', { responseType: 'blob' });

export const getAirQuality = (location) =>
  api.get(`/extras/airquality?location=${location}`);