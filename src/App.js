import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';


function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      setCookie("token", token, { path: "/"});
      navigate(location.pathname, {replace:true});
    }
  }, [location, navigate]);

  function setCookie(name, user_id) {
    const expires = new Date(Date.now() + 86400_000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(user_id)};expires=${expires};path=/`
  }

  setCookie("session_id","1");
  setCookie("agent_id", "langchain-agent-01-spotify")
  setCookie("route", "predict")
  setCookie("auth_server", "https://spotify-oauth-206239759924.us-central1.run.app/login")
  setCookie("scope", "user-library-read user-top-read")

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\/+^])/g,'\\$1') + '=([^;]*)')
    )
    return match ? decodeURIComponent(match[1]) : null
  }
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse('');

    const currentWindow = window.location.href

    const params = new URLSearchParams({
      scopes: getCookie("scope"),
      return_url: currentWindow
    })

    window.location.href = `${getCookie("auth_server")}?${params}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    try {
        
      const { data } = await axios.post(
        process.env.REACT_APP_AGENT_URL,
        {token: getCookie("token"), prompt, session_id: getCookie("session_id")},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // assuming your API responds { text: "..." }
      setResponse(data.response ?? JSON.stringify(data));
    } catch (err) {
      console.error(err);
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

      <form onSubmit={handleLogin}>
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          {"login"}
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

};
export default App;