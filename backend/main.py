import requests
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import urllib.parse

# Load the environment variables from the .env file
load_dotenv()

# Securely grab the variables
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL", "").strip().rstrip('/')
SCOPE = "user-top-read user-read-recently-played"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "online"}

@app.get("/login")
def login():
    query_params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": SCOPE,
        "show_dialog": "true"
    }

    auth_url = f"https://accounts.spotify.com/authorize?{urllib.parse.urlencode(query_params)}"

    return RedirectResponse(url=auth_url)

@app.get("/callback")
def callback(code: str):
    token_url = "https://accounts.spotify.com/api/token"

    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(token_url, data=payload, headers=headers)
    token_data = response.json()

    access_token = token_data.get("access_token")

    if not access_token:
        return{"error": "Failed to retrieve access token", "details": token_data}
    
    frontend_url = f"{FRONTEND_URL}?token={access_token}"
    return RedirectResponse(url=frontend_url)

@app.get("/api/tracks")
def get_clean_tracks(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization token provided")
    
    top_tracks_url = "https://api.spotify.com/v1/me/top/tracks"
    auth_headers = {
        "Authorization": authorization
    }
    track_params = {
        "limit": 25,
        "time_range": "long_term"
    }

    tracks_response = requests.get(top_tracks_url, headers=auth_headers, params=track_params)
    
    if tracks_response.status_code != 200:
        raise HTTPException(status_code=tracks_response.status_code, detail="Failed to fetch from Spotify")
        
    top_tracks_data = tracks_response.json()

    clean_tracks = []
    for track in top_tracks_data.get("items", []):
        track_info = {
            "name": track.get("name"),
            "artist": ", ".join([artist.get("name") for artist in track.get("artists", [])]),
            "album_art": track.get("album", {}).get("images", [{}])[0].get("url"),
            "spotify_url": track.get("external_urls", {}).get("spotify")
        }
        clean_tracks.append(track_info)
    
    return {"top_tracks": clean_tracks}