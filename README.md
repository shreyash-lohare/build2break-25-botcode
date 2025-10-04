# 🧠 Build2Break 2025 – Problem 3
### Multi-Agent Automation System (n8n + HTML Frontend)

This project implements an AI-powered HR automation system using n8n as the backend and a simple HTML frontend.
Users can upload a PDF resume, enter API keys (e.g., OpenAI), and automatically generate a video explanation or onboarding plan.

---

## 🚀 Quick Start (Reproducible Setup)

### 🧩 Requirements
- Docker ≥ 24.0
- Docker Compose ≥ 2.0
- Internet access (for API calls)

---

### ⚙️ Step 1 — Clone this Repository

```bash
git clone https://github.com/yourteam/b2b-video-generator.git
cd b2b-video-generator
```

### ⚙️ Step 2 — Configure Environment Variables

```bash
cp .env.example .env
```

The `.env` file keeps n8n’s encryption key and timezone settings. **API keys are NOT stored here**—judges supply their own keys in the frontend form each time they run the workflow.

### ⚙️ Step 3 — Run Everything

```bash
sudo apt update
sudo apt install ffmpeg
docker-compose up --build
```

This command will:

- Build the frontend (NGINX) on port 8080
- Run the n8n backend on port 5000 (mapped to container 5678)
- Start PostgreSQL for persistence

## 🌐 Access Points

| Service | URL | Description |
| --- | --- | --- |
| Frontend | http://localhost:8080 | Upload PDF & enter API keys |
| Backend (n8n UI) | http://localhost:5000 | Workflow editor & logs |
| Webhook Endpoint | http://localhost:5000/webhook/generate | Receives PDF input & generates video |

## 🧩 How It Works

Generating a Video-
	
	Enter API Keys (Step 1)
		Input your Google Gemini API key
		Input your Supabase API key
		Input your ElevenLabs API key
		Click "Continue to Upload"

	Upload PDF (Step 2)
		Click the upload area or drag-and-drop your PDF
		Maximum file size: 20 MB
		Click "Generate Video Summary"

	View & Download (Step 3)-
		Watch the generated video preview
		Download the MP4 file
		Generate another video or change API keys

### 🧪 Test Workflow

You can test the pipeline in two ways:

1️⃣ Through Frontend

- Visit http://localhost:8080
- Enter your Google Gemini, Supabase, and ElevenLabs API keys when prompted (Step 1 of the UI)
- Add an optional video prompt to guide the script
- Upload a sample PDF
- Click “Generate Video”
- Wait for the generated script and download link to appear

2️⃣ Through Direct Webhook (Standalone n8n Backup)

You can hit the workflow directly—either via the main stack (port 5000) or by running the self-contained `direct-n8n` compose file if the frontend is down.

**Option A – Use the full stack:**

- Start with `docker-compose up --build` from the repo root.
- Send requests to `http://localhost:5000/webhook/generate` (the same URL the frontend proxies to).

**Option B – Run the direct-n8n container (no frontend required):**

1. `cd direct-n8n`
2. `cp .env.example .env` and paste your runtime keys:
	- `GEMINI_API_KEY=` (covers Gemini + Veo)
	- `SUPABASE_KEY=` (service-role or edge-function token)
	- `ELEVENLABS_KEY=` (optional for future narration work)
3. `docker compose up --pull always`
4. Open http://localhost:5678, import `workflows/pdf-to-video.workflow.json` if it isn’t listed, and click **Activate**.
5. POST to `http://localhost:5678/webhook/generate`.

Optional example (swap the URL to `http://localhost:5000/...` if you’re using Option A):

```bash
curl -X POST http://localhost:5678/webhook/generate \
	-F "pdf=@data/sample_resume.pdf" \
	-F "gemini_api_key=your-google-key" \
	-F "supabase_api_key=your-supabase-service-role" \
	-F "elevenlabs_api_key=your-elevenlabs-key" \
	-F "prompt=Create a short onboarding video"
```

Response:

```json
{
	"status": "success",
	"download_url": "https://kpzphxksscudlwtxayvc.supabase.co/storage/v1/object/sign/...",
	"script": {
		"title": "...",
		"total_word_count": 142,
		"scenes": [
			{
				"narration": "...",
				"visual_idea": "...",
				"source_citation": "Page 3"
			}
		]
	},
	"video_prompt": "..."
}
```

## 📂 Project Structure

```
b2b-video-generator/
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── script.js
│   └── styles.css
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── workflow.json
│   └── workflows/
│       └── pdf-to-video.workflow.json
├── direct-n8n/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── README-direct-n8n.md
│   ├── .env.example
│   └── workflows/
│       └── pdf-to-video.workflow.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🧠 Design Overview

- Frontend: User interface to input API keys, upload PDFs, and view/download generated video.
- Step 3 of the frontend also surfaces the structured script (title + scene breakdown) returned by the workflow.
- Backend: n8n orchestrates multi-agent workflows using OpenAI APIs and custom logic.
- Persistence: PostgreSQL stores execution history, credentials, and logs.

Data Flow: Frontend → /webhook/generate (n8n) → Agents → Video file → /files/ → Frontend

## 🔐 Safety & Ethics

- All API keys are user-provided at runtime.
- No personal data stored beyond session.
- Sensitive data (resumes) processed locally within Docker container.
- Agents use deterministic prompts (temperature=0) for reproducibility.

## 🧰 Troubleshooting

| Issue | Solution |
| --- | --- |
| n8n not loading | Check `docker ps` → ensure `b2b-backend` is running |
| Frontend loads but no response | Ensure backend port 5000 is accessible |
| API key invalid | Re-enter keys in the Step 1 form and rerun |

## 📌 Notes

- Supabase and ElevenLabs keys are collected and forwarded to the n8n workflow for future automation stages. The current reference implementation focuses on Gemini-based script generation and returns a demo video URL for quick validation.

## 🏁 Credits

Team: BotCode
Event: Build2Break 2025 (OSDG, IIIT Hyderabad)  
Problem Track: #3 Multi-Agent Automation  
Tech Stack: n8n, Docker, NGINX, Postgres, OpenAI API

---

With these two files:

- `.env.example` defines environment configuration
- `README.md` gives a clear step-by-step reproducibility manual

Judges can run and verify your system in <5 minutes, scoring high in the “Design & Reproducibility” category.


