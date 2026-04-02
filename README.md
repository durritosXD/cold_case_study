# cold-case-analyzer
# Cold Case AI — Forensic Analysis Engine

A noir-themed web app that ingests any cold case text and returns a structured forensic analysis using Google Gemini AI.

## Features

- Suspect rankings with probability scores
- Reconstructed event timeline
- Logical inconsistency flags (Critical / Moderate / Minor)
- Evidence strength ratings (Strong / Weak / Missing)
- AI verdict with confidence percentage
- What investigators missed

## Stack

| Layer   | Choice |
|---------|--------|
| Frontend | Pure HTML + CSS + Vanilla JS |
| AI      | Google Gemini 2.5 Flash-Lite |
| Hosting | GitHub Pages (free) |
| Cost    | $0 |

## Setup

### 1. Get a free Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with any Google account
3. Click **Get API Key** → **Create API Key**
4. Copy the key

### 2. Add your key to app.js

Open `app.js` and replace:

```js
const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
```

with your actual key.

> **Security tip:** Before pushing to GitHub, either remove the key from the file
> and prompt for it on page load, or set a strict daily quota cap in AI Studio.

### 3. Add case text files

Open each file in `cases/` and replace the placeholder text with the full
Wikipedia article text for that case (copy-paste from Wikipedia, it's public domain).

### 4. Run locally

Just open `index.html` in any browser. No build step, no npm.

Or use a local server (avoids ES module CORS issues):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a new GitHub repo called `cold-case-analyser`
2. Push all files to the `main` branch
3. Go to **Settings → Pages**
4. Set Source: **Deploy from branch → main → / (root)**
5. Live at: `https://yourusername.github.io/cold-case-analyser`

## File Structure

```
cold-case-analyser/
├── index.html       ← app shell + all 9 UI sections
├── style.css        ← noir dark theme (no frameworks)
├── app.js           ← API calls, rendering, event handlers
├── prompts.js       ← Gemini prompt engineering
├── cases/
│   ├── db-cooper.txt
│   ├── zodiac.txt
│   └── black-dahlia.txt
└── README.md
```

## Resume Description

> "Built a forensic AI web app that ingests unstructured cold case text and uses Gemini 2.5 to reconstruct event timelines, rank suspects by probability score, flag logical inconsistencies, and generate a confidence-weighted verdict — deployed on GitHub Pages with zero backend infrastructure."