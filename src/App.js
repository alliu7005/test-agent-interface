import React, { useState } from 'react';
import api from './api';

function App() {
  const [form_id, setFormId] = useState('');
  const [spreadsheet_id, setSpreadsheetId] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const { data } = await api.post(
        "/process_form",
        { "form_id": form_id, "spreadsheet_id": spreadsheet_id, "name": "TEST" },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );
      // assuming your API responds { text: "..." }
      setResponse(data.text ?? JSON.stringify(data));
    } catch (err) {
      if (err.response?.status === 401) {
        const { authUrl } = err.response.data.detail || err.response.data;
        window.location.href = authUrl;
      } else {
        console.error(err);
      }
  }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>CrewAI Agent UI</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={form_id}
          onChange={e => setFormId(e.target.value)}
          placeholder="Enter your form id"
          rows={1}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <textarea
          value={spreadsheet_id}
          onChange={e => setSpreadsheetId(e.target.value)}
          placeholder="Enter your spreadsheet id"
          rows={1}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button type="submit" disabled={loading || !form_id.trim() || !spreadsheet_id.trim()} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Thinking…' : 'Send'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          Error: {error}
        </div>
      )}

      {response && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <strong>Agent says:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;