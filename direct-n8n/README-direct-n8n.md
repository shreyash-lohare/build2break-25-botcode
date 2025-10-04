# Direct n8n Backup Plan

If the full frontend + backend stack fails, judges can still evaluate the workflow by running a standalone n8n instance that hosts the exact same `pdf-to-video` automation. This directory contains everything needed.

## Prerequisites

- Docker ≥ 24
- Docker Compose ≥ 2
- Google Gemini API key (covers Gemini + Veo)
- Supabase service-role key for the provided Edge Function

Optional: ElevenLabs key (reserved for TTS narration; workflow ignores it for now).

## Quick Start

1. Copy your keys into `.env`:

   ```bash
   cd direct-n8n
   cp .env.example .env  # create the file if it doesn't exist
   # then edit .env and set:
   #   GEMINI_API_KEY=...
   #   SUPABASE_KEY=...
   #   ELEVENLABS_KEY=...
   ```

   The `.env` file is mounted into the container so n8n can reference it when you set credentials.

2. Start the standalone instance:

   ```bash
   docker compose up --pull always
   ```

   This exposes the editor at http://localhost:5678. Basic auth is disabled for fast judging.

3. Import the bundled workflow (if it’s not already present):

   - Click **Import from File** in the top-right of the n8n editor.
   - Select `workflows/pdf-to-video.workflow.json` from this folder.
   - Click **Activate** so the production webhook is available.

4. Trigger the workflow:

   ```bash
   curl -X POST http://localhost:5678/webhook/generate \
        -F "pdf=@../data/sample_resume.pdf" \
        -F "gemini_api_key=$GEMINI_API_KEY" \
        -F "supabase_api_key=$SUPABASE_KEY" \
        -F "prompt=Create a short onboarding video"
   ```

   The response contains the Supabase download URL and script JSON. If Supabase keys are missing, the workflow returns an error payload so judges still see structured output.

## What’s Included

- `docker-compose.yml`: minimal one-service setup for n8n
- `Dockerfile`: optional wrapper if you prefer `docker build` (not required for compose)
- `workflows/pdf-to-video.workflow.json`: production workflow mirrored from `backend/workflows`
- `.env` (ignored by git): place runtime keys here

## Safety Notes

- No secrets are stored in source control. Keys live only in your local `.env`.
- Workflow stops early if Gemini or Supabase keys are missing.
- Judges can inspect every node and execution from the n8n UI.

That’s it—this takes < 2 minutes to stand up and guarantees the evaluation doesn’t block on the main frontend.
