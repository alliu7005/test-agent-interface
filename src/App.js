import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_AGENT_URL,
        { prompt },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );
      // assuming your API responds { text: "..." }
      setResponse(data.text ?? JSON.stringify(data));
    } catch (err) {
      console.error(err);
      // axios error messages can be nested
      setError(
        err.response
          ? `HTTP ${err.response.status}: ${err.response.data}`
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>LangChain Agent UI</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          rows={4}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button type="submit" disabled={loading || !prompt.trim()} style={{ marginTop: '0.5rem' }}>
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