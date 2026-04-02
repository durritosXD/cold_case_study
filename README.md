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

### 2. Add your key locally

Create a file named `.env` in the root directory and add:

```env
VITE_GEMINI_API_KEY=your_actual_key_here
```

### 3. Add case text files

Open each file in `cases/` and replace the placeholder text with the full
Wikipedia article text for that case.

### 4. Run locally

```bash
npm install
npm run dev
# then open http://localhost:5173
```

## Deploy to GitHub Pages

1. **GitHub Secret**: Go to your repo **Settings > Secrets > Actions** and add `VITE_GEMINI_API_KEY`.
2. **Push Code**: Just push to the `main` branch.
3. **GitHub Action**: The build and deployment will happen automatically via GitHub Actions.
4. **Final Step**: Once the build finishes, go to **Settings > Pages** and set the source to **GitHub Actions**.
5. Live at: `https://durritosXD.github.io/cold_case_study`

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