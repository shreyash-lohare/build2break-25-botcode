Perfect! Let's design a robust, defensible n8n agent architecture for PS3. I'll create a comprehensive multi-agent system optimized for both functionality and defense against Break phase attacks.

## PS3: PDF → YouTube Shorts Agent Architecture

### 🎯 High-Level Architecture

```
PDF Input → ContentExtractor → ScriptWriter → VisualsPlanner → 
AnimationGenerator → Narrator → VideoComposer → Output (MP4)
                ↓
         CitationTracker (runs parallel, feeds all agents)
```

### 📋 Detailed Agent Breakdown

#### **Agent 1: ContentExtractor**
**Role:** Parse PDF and extract key information

**Tools/Nodes:**
- PDF parser (PyPDF2 via Code node or HTTP Request to parsing API)
- LLM (GPT-4/Claude) for semantic extraction
- Memory storage for citations

**Outputs:**
- Main topics/key points (3-5 points max for <60s video)
- Page numbers and source citations
- Images/diagrams from PDF
- Hierarchical content structure

**Defensive Considerations:**
- Validate PDF structure before processing
- Sanitize extracted text to prevent injection
- Log all extraction steps for audit

---

#### **Agent 2: ScriptWriter**
**Role:** Create engaging 45-55 second narration script

**Tools/Nodes:**
- LLM with specific prompt engineering
- Token counter to ensure timing
- Citation formatter

**Prompt Template:**
```
Create a 45-55 second YouTube Shorts script from this content:
{extracted_content}

Rules:
- Use conversational, engaging language
- Break into 3-4 key scenes
- Each scene should be 12-15 seconds
- Include natural pauses for visual emphasis
- Mark citation points with [CITE: page X]
- No complex jargon, explain simply
- End with a hook or call-to-action
```

**Outputs:**
- Timestamped script segments
- Scene descriptions for visuals
- Citation markers embedded

---

#### **Agent 3: VisualsPlanner**
**Role:** Design doodle/sketch concepts for each scene

**Tools/Nodes:**
- Vision LLM (GPT-4V/Claude) to understand PDF images
- Prompt generator for image generation
- Scene-to-visual mapper

**For Each Scene:**
- Generate detailed doodle prompts
- Specify animation style (sketch, whiteboard, hand-drawn)
- Plan visual transitions

**Example Output:**
```json
{
  "scene_1": {
    "duration": 12,
    "visual_style": "hand-drawn sketch",
    "elements": [
      "sketch of a brain with neurons firing",
      "hand drawing arrows connecting concepts",
      "doodle-style lightbulb appearing"
    ],
    "animation_type": "progressive_reveal",
    "citation_overlay": "Source: Page 3"
  }
}
```

---

#### **Agent 4: AnimationGenerator**
**Role:** Generate actual doodle animations

**Two Approaches (you can choose):**

**Option A: AI Image Generation + Animation**
- Use Stable Diffusion/DALL-E with specific doodle prompts
- Generate keyframe images
- Use Motion/Animation libraries (D-ID, Runway, or local tools)
- Compile into video segments

**Option B: Procedural Generation**
- Use Manim for mathematical/diagram content
- Use Python libraries (moviepy, cairo) for sketch animations
- Generate SVG paths that animate drawing
- Simulate hand-drawing effect

**n8n Implementation:**
- HTTP Request nodes to Stable Diffusion API
- Code node for video processing (FFmpeg)
- Loop through each scene
- Merge animations with transitions

**Defensive Notes:**
- Validate generated content isn't offensive
- Ensure animations match script timing
- Log generation parameters

---

#### **Agent 5: Narrator**
**Role:** Generate voiceover from script

**Tools/Nodes:**
- Text-to-Speech API (ElevenLabs, OpenAI TTS, Azure)
- Voice selection (energetic, clear, engaging)
- Audio processing for pacing

**Configuration:**
- Speed: 1.1-1.2x (energetic YouTube pace)
- Pauses: 0.5-1s between scenes
- Emphasis on key words
- Background music (optional, low volume)

**Outputs:**
- MP3/WAV audio file
- Timestamp alignment with script

---

#### **Agent 6: VideoComposer**
**Role:** Combine animations, audio, citations into final video

**Tools/Nodes:**
- FFmpeg (via Code node or HTTP Request)
- Video editing library (moviepy)
- Overlay text for citations

**Composition Steps:**
1. Layer animations sequentially
2. Add voiceover audio track
3. Overlay citations at specified times (subtle, bottom corner)
4. Add intro/outro (2-3s each)
5. Optimize for YouTube Shorts (1080x1920, 9:16)
6. Export as MP4

**Citation Display:**
- Fade in at mention points
- Format: "Source: [PDF Name], p.X"
- Small, unobtrusive text
- Auto-disappear after 2-3 seconds

---

#### **Agent 7: CitationTracker (Orchestrator)**
**Role:** Maintain source integrity throughout pipeline

**Functions:**
- Track all content back to PDF pages
- Ensure every claim is cited
- Generate citation list for video description
- Audit trail for reproducibility

**Memory Structure:**
```json
{
  "citations": [
    {"content": "Neural networks learn...", "page": 5, "timestamp": "0:12"},
    {"content": "Research shows...", "page": 8, "timestamp": "0:34"}
  ],
  "pdf_metadata": {
    "title": "...",
    "author": "...",
    "pages": 120
  }
}
```

---

### 🔄 n8n Workflow Structure

**Main Workflow:**
1. **Webhook/Manual Trigger** (receives PDF)
2. **ContentExtractor** (Function node → OpenAI/Claude)
3. **Branch:**
   - Path A: ScriptWriter → Narrator
   - Path B: VisualsPlanner → AnimationGenerator
4. **Merge Node** (wait for both paths)
5. **VideoComposer**
6. **Output Node** (save to storage, return URL)

**Memory/State Management:**
- Use n8n's Postgres node or Redis for shared state
- Each agent reads/writes to shared memory
- CitationTracker maintains master record

---
