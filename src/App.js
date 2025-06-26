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

  setCookie("user_id","1");
  setCookie("agent_id",)
  setCookie("route", "chat")
  setCookie("auth_server", "https://host-spotify-vertexai-365383383851.us-central1.run.app")
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
      scope: getCookie("scope"),
      auth_server: getCookie("auth_server"),
      return_window: currentWindow
    })

    window.location.href = `${process.env.REACT_APP_LOGIN_URL}?${params}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const payload = { token: getCookie("token"), 
          prompt, 
          agent_id: getCookie("agent_id"), 
          user_id: getCookie("user_id"), };
      
      if (getCookie("session_id")) {
        payload.session_id = getCookie("session_id")
      }
        
      const { data } = await axios.post(
        process.env.REACT_APP_AGENT_URL,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // assuming your API responds { text: "..." }
      setResponse(data.response ?? JSON.stringify(data));
      setCookie("session_id", data.session_id)
    } catch (err) {
      if (err.response?.status === 401) {
        const { authUrl } = err.response.data.detail || err.response.data;
        console.log(authUrl)
        window.location.href = authUrl;
      } else {
        console.error(err);
      }
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