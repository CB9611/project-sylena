import { useState, useEffect, useRef } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [token, setToken] = useState(null)
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isBooting, setIsBooting] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const sliderRef = useRef(null)
  const slideRefs = useRef([])

  const handleLogin = async () => {
    setIsBooting(true);

    const minWait = new Promise((resolve) => setTimeout(resolve, 3000));

    const startBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`)
        if (response.ok) {
          await minWait;
          window.location.href = `${API_BASE_URL}/login`;
        } else {
          throw new Error("Waking up...");
        }
      } catch (error) {
        setTimeout(startBackend, 3000);
      }
    };

    startBackend();
  }

  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const accessToken = urlParams.get('token')

    if (accessToken) {
      setToken(accessToken)
      window.history.pushState({}, null, '/')
    }
  }, [])

  useEffect(() => {
    if (token) {
      setLoading(true)

      fetch(`${API_BASE_URL}/api/tracks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setTracks(data.top_tracks)
          setLoading(false)
        })
        .catch(error => {
          console.error("Error fetching tracks:", error)
          setLoading(false)
        })
    }
  }, [token])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentTrackIndex(Number(entry.target.dataset.index))
          }
        });
      },
      { threshold: 0.5 }
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [tracks]);

  const scrollToTop = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (isBooting) {
    return (
      <div className="loading-container">
        <h1>Project Sylena // Loading</h1>
        <p>Curating your Soundscape...</p>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="App">
      {!token ? (
        <div className="login-screen">
          <h1>Project Sylena</h1>
          <p className="hero-description">
            Experience your music in high fidelity. Project Sylena connects to your Spotify
            profile to generate a visual-first showcase of your <strong>top 25 most played tracks</strong>.
          </p>
          <button className="login-button" onClick={handleLogin}>Log in with Spotify</button>
          <div className="hero-links">
            <a href="https://cameronbranch.com" target="_blank" rel="noreferrer">Portfolio</a>
            <a href="https://github.com/CB9611" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/CB9611" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <footer className="footer">
            <p>
              © Cameron Branch {new Date().getFullYear()}, unless otherwise noted. All rights reserved. • Powered by{' '}
              <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a>,{' '}
              <a href="https://fastapi.tiangolo.com" target="_blank" rel="noopener noreferrer">FastAPI</a> &{' '}
              <a href="https://www.python.org" target="_blank" rel="noopener noreferrer">Python</a>
            </p>
          </footer>
        </div>
      ) : (
        <>
          {tracks.length > 0 && (
            <div className="track-counter">
              {currentTrackIndex + 1} <span className="counter-total">/ {tracks.length}</span>
            </div>
          )}

          {currentTrackIndex > 0 && (
            <button className="back-to-top" onClick={scrollToTop}>
              ↑ Top
            </button>
          )}

          <div className="track-slider" ref={sliderRef}>
            {loading && <div className="loading">Loading your heavy rotation...</div>}

            {tracks.map((track, index) => (
              <div
                key={index}
                className="track-slide"
                data-index={index}
                ref={(el) => (slideRefs.current[index] = el)}
              >

                <div
                  className="bg-blur"
                  style={{ backgroundImage: `url(${track.album_art})` }}
                ></div>

                <div className="glass-panel">
                  <img src={track.album_art} alt="Album Art" className="glass-art" />
                  <div className="glass-info">
                    <h2>{track.name}</h2>
                    <h3>{track.artist}</h3>
                    <a href={track.spotify_url} target="_blank" rel="noreferrer" className="listen-btn">
                      Listen on Spotify
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App