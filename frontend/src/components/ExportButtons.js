import React, { useState } from 'react';
import { exportJSON, exportCSV, exportPDF, exportMarkdown, exportXML } from '../api';

function ExportButtons() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const downloadBlob = (data, filename, type) => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportJSON = async () => {
    setLoading('json');
    setError('');
    try {
      const res = await exportJSON();
      downloadBlob(
        JSON.stringify(res.data, null, 2),
        'weather_searches.json',
        'application/json'
      );
      setSuccess('JSON exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'No data to export');
    } finally {
      setLoading(null);
    }
  };

  const handleExportCSV = async () => {
    setLoading('csv');
    setError('');
    try {
      const res = await exportCSV();
      downloadBlob(res.data, 'weather_searches.csv', 'text/csv');
      setSuccess('CSV exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('No data to export');
    } finally {
      setLoading(null);
    }
  };

  const handleExportPDF = async () => {
    setLoading('pdf');
    setError('');
    try {
      const res = await exportPDF();
      downloadBlob(res.data, 'weather_report.pdf', 'application/pdf');
      setSuccess('PDF exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('No data to export');
    } finally {
      setLoading(null);
    }
  };

  const handleExportMarkdown = async () => {
    setLoading('markdown');
    setError('');
    try {
      const res = await exportMarkdown();
      downloadBlob(res.data, 'weather_report.md', 'text/markdown');
      setSuccess('Markdown exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('No data to export');
    } finally {
      setLoading(null);
    }
  };

  const handleExportXML = async () => {
  setLoading('xml');
  setError('');
  try {
    const res = await exportXML();
    downloadBlob(res.data, 'weather_report.xml', 'application/xml');
    setSuccess('XML exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    setError('No data to export');
  } finally {
    setLoading(null);
  }
};

  return (
    <div className="export-container card">
      <h2>Export Data</h2>
      <p className="export-description">
        Export all your saved weather searches in your preferred format.
      </p>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <div className="export-grid">
        <div className="export-card">
          <div className="export-icon-box json-color">
            <span>JSON</span>
          </div>
          <h3>JSON Format</h3>
          <p>Export as structured JSON data</p>
          <button
            onClick={handleExportJSON}
            className="export-btn json-btn"
            disabled={loading === 'json'}
          >
            {loading === 'json' ? 'Exporting...' : 'Export JSON'}
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon-box xml-color">
            <span>XML</span>
          </div>
          <h3>XML Format</h3>
          <p>Export as XML document</p>
          <button
            onClick={handleExportXML}
            className="export-btn xml-btn"
            disabled={loading === 'xml'}
          >
            {loading === 'xml' ? 'Exporting...' : 'Export XML'}
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon-box csv-color">
            <span>CSV</span>
          </div>
          <h3>CSV Format</h3>
          <p>Export as spreadsheet data</p>
          <button
            onClick={handleExportCSV}
            className="export-btn csv-btn"
            disabled={loading === 'csv'}
          >
            {loading === 'csv' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon-box pdf-color">
            <span>PDF</span>
          </div>
          <h3>PDF Format</h3>
          <p>Export as PDF report</p>
          <button
            onClick={handleExportPDF}
            className="export-btn pdf-btn"
            disabled={loading === 'pdf'}
          >
            {loading === 'pdf' ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon-box md-color">
            <span>MD</span>
          </div>
          <h3>Markdown Format</h3>
          <p>Export as Markdown document</p>
          <button
            onClick={handleExportMarkdown}
            className="export-btn md-btn"
            disabled={loading === 'markdown'}
          >
            {loading === 'markdown' ? 'Exporting...' : 'Export Markdown'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportButtons;