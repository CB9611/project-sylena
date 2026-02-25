from fastapi import FastAPI
from dotenv import load_dotenv
import os

# Load the environment variables from the .env file
load_dotenv()

# Securely grab the variables
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

app = FastAPI()

# ... (the rest of your existing routes can stay below this)