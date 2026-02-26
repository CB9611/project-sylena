# Project Sylena

> A Full-Stack Data Pipeline and Analytics Dashboard for Spotify

## Overview
Project Sylena is a custom-built ETL (Extract, Transform, Load) pipeline and decoupled web application that integrates directly with the Spotify Web API. Designed with a data engineering mindset, the backend securely handles the OAuth 2.0 authorization code flow to authenticate users and extract raw listening data. The Python API then transforms complex, heavily nested JSON responses into a lightweight, structured dataset before serving it to the frontend.

The presentation layer is a highly responsive, React-based dashboard featuring a native-feeling, vertical snap-scrolling interface. It utilizes a modern glassmorphism aesthetic to display the user's top tracks, dynamically powered by the native Intersection Observer API to track viewport rendering and manage state without bloated third-party libraries.

## Key Features
* **Custom ETL Pipeline:** Extracts raw Spotify data, strips out unnecessary metadata, and loads a clean, strictly formatted JSON array to the client.

* **OAuth 2.0 Security:** Secure backend handshake handling the initial authorization, token exchange, and environment-based CORS routing.

* **Decoupled Architecture:** A strict separation of concerns between the FastAPI data manipulation layer and the React presentation layer.

* **Optimized UI/UX:** CSS-driven vertical scroll-snap physics for buttery smooth navigation, complete with a dynamic track counter, background blurring, and glass-frosted overlays.

## Tech Stack
This project is built with a decoupled frontend and backend architecture to ensure secure data handling and a responsive user interface.

**Frontend**
- React.js
- Vite
- JavaScript / HTML

**Backend & Data Handling**
- Python
- FastAPI
- RESTful APIs (Spotify Web API)
- Uvicorn (ASGI Web Server)

## How to Run Locally

Because this project uses a decoupled architecture, you will need to run two separate servers simultaneously: the Python backend and the Vite frontend.

### Prerequisites
* Python 3.8+
* Node.js & npm
* A Spotify Developer account (to generate API credentials)

### 1. Backend Setup (FastAPI)
Open a terminal and navigate to the root directory of the project, then enter the `backend` folder:

\`\`\`bash
cd backend
\`\`\`

Create and activate a virtual environment:
\`\`\`bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
\`\`\`

Install the required Python dependencies:
\`\`\`bash
pip install fastapi uvicorn requests python-dotenv
\`\`\`

Create a `.env` file in the `backend` directory and add your Spotify API credentials. It must look exactly like this:
\`\`\`text
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8000/callback
FRONTEND_URL=http://localhost:5173
\`\`\`

Start the FastAPI server:
\`\`\`bash
uvicorn main:app --reload
\`\`\`
*The backend is now running on `http://127.0.0.1:8000`*

### 2. Frontend Setup (React/Vite)
Open a **new** terminal window (leave the backend running) and navigate to the `frontend` directory:

\`\`\`bash
cd frontend
\`\`\`

Install the required Node dependencies:
\`\`\`bash
npm install
\`\`\`

Start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`
*The frontend is now running on `http://localhost:5173`*

### 3. Usage
Open your browser and navigate to `http://localhost:5173`. Click the **Log in with Spotify** button to initiate the OAuth 2.0 handshake and generate your personalized dashboard.

---

## Author

**Cameron Branch**
- **Portfolio** [cameronbranch.com](https://cameronbranch.com)
- **GitHub:** [github.com/CB9611](https://github.com/CB9611)
- **LinkedIn:** [linkedin.com/in/CB9611](https://linkedin.com/in/CB9611)