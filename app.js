// API calls, all render functions, event handlers
import { buildAnalysisPrompt } from './prompts.js';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Managed via .env (gitignored)

// ─── API ──────────────────────────────────────────────────────────────────────
async function analyseCase(caseText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildAnalysisPrompt(caseText) }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 8192
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const candidate = data.candidates[0];

  if (candidate.finishReason === 'MAX_TOKENS') {
    throw new Error("Case analysis was too detailed and got cut off (MAX_TOKENS). Try reducing the case text or asking for a shorter summary.");
  }

  const raw = candidate.content.parts[0].text;
  const clean = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch (parseErr) {
    console.error("Raw response:", raw);
    throw new Error(`Invalid JSON returned from AI: ${parseErr.message}`);
  }
}

// ─── RENDER HELPERS ──────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sigColor(sig) {
  return sig === "high" ? "var(--danger)" : sig === "medium" ? "var(--warning)" : "var(--muted)";
}

function severityClass(s) {
  return s === "critical" ? "critical" : s === "moderate" ? "moderate" : "minor";
}

function strengthClass(s) {
  return s === "strong" ? "badge-strong" : s === "weak" ? "badge-weak" : "badge-missing";
}

function suspectBorderColor(score) {
  if (score > 70) return "var(--danger)";
  if (score >= 40) return "var(--warning)";
  return "var(--success)";
}


function renderSummary(data) {
  const el = document.getElementById('summary-text');
  if (el) el.textContent = data.case_summary;
  show('section-summary');
}

function renderTimeline(data) {
  const container = document.getElementById('timeline-entries');
  if (!container || !data.timeline) return;
  container.innerHTML = data.timeline.map(entry => `
    <div class="timeline-entry">
      <span class="timeline-dot" style="background:${sigColor(entry.significance)}"></span>
      <div class="timeline-body">
        <strong class="timeline-date">${escHtml(entry.date)}</strong>
        <p class="timeline-event">${escHtml(entry.event)}</p>
      </div>
    </div>
  `).join('');
  show('section-timeline');
}

function renderSuspects(data) {
  const container = document.getElementById('suspects-grid');
  if (!container || !data.suspects) return;
  const sorted = [...data.suspects].sort((a, b) => b.probability_score - a.probability_score);
  container.innerHTML = sorted.map((s, i) => `
    <div class="suspect-card" style="border-color:${suspectBorderColor(s.probability_score)}">
      <div class="suspect-header">
        <span class="suspect-name">${escHtml(s.name)}</span>
        <span class="suspect-score" style="color:${suspectBorderColor(s.probability_score)}">${s.probability_score}%</span>
      </div>
      <div class="suspect-meta">
        <div><span class="label">MOTIVE</span><br>${escHtml(s.motive)}</div>
        <div><span class="label">OPPORTUNITY</span><br>${escHtml(s.opportunity)}</div>
      </div>
      <details class="evidence-toggle">
        <summary>Evidence</summary>
        <div class="evidence-cols">
          <div>
            <div class="label against">Against</div>
            <ul>${(s.evidence_against || []).map(e => `<li>${escHtml(e)}</li>`).join('')}</ul>
          </div>
          <div>
            <div class="label for">For</div>
            <ul>${(s.evidence_for || []).map(e => `<li>${escHtml(e)}</li>`).join('')}</ul>
          </div>
        </div>
      </details>
      <div class="suspect-alibi"><span class="label">ALIBI</span> ${escHtml(s.alibi)}</div>
    </div>
  `).join('');
  show('section-suspects');
}

function renderInconsistencies(data) {
  const container = document.getElementById('inconsistencies-list');
  if (!container || !data.inconsistencies) return;
  container.innerHTML = data.inconsistencies.map(inc => `
    <div class="alert-card ${severityClass(inc.severity)}">
      <span class="severity-badge">${inc.severity.toUpperCase()}</span>
      <p>${escHtml(inc.description)}</p>
    </div>
  `).join('');
  show('section-inconsistencies');
}

function renderEvidence(data) {
  const container = document.getElementById('evidence-grid');
  if (!container || !data.evidence) return;
  container.innerHTML = data.evidence.map(ev => `
    <div class="evidence-card ${ev.strength === 'missing' ? 'missing' : ''}">
      <div class="evidence-item-name">${escHtml(ev.item)}</div>
      <span class="badge ${strengthClass(ev.strength)}">${ev.strength.toUpperCase()}</span>
      <p class="evidence-notes">${escHtml(ev.notes)}</p>
    </div>
  `).join('');
  show('section-evidence');
}

function renderMissing(data) {
  const container = document.getElementById('missing-list');
  if (!container || !data.missing_info) return;
  container.innerHTML = data.missing_info.map(m => `<li>${escHtml(m)}</li>`).join('');
  show('section-missing');
}

function renderVerdict(data) {
  const v = data.verdict;
  if (!v) return;
  const pct = Math.min(100, Math.max(0, v.confidence_percent));
  const barColor = pct >= 70 ? "var(--danger)" : pct >= 40 ? "var(--warning)" : "var(--success)";

  const scenarioEl = document.getElementById('verdict-scenario');
  const pctEl = document.getElementById('verdict-pct');
  const barEl = document.getElementById('verdict-bar-fill');
  const reasoningEl = document.getElementById('verdict-reasoning');

  if (scenarioEl) scenarioEl.textContent = v.most_likely_scenario;
  if (pctEl) pctEl.textContent = pct + "%";
  if (barEl) barEl.style.cssText = `width:${pct}%; background:${barColor}`;
  if (reasoningEl) reasoningEl.textContent = v.reasoning;
  show('section-verdict');
}
function renderGeographic(data) {
  const el = document.getElementById('geo-text');
  if (el && data.geographic_profile) {
    el.textContent = data.geographic_profile;
    show('section-geo');
  }
}

function renderNextSteps(data) {
  const container = document.getElementById('next-steps-list');
  if (!container || !data.investigative_next_steps) return;
  container.innerHTML = `<ul>` + data.investigative_next_steps.map(step => `
    <li class="next-step-item">
      <div class="next-step-icon" style="color:${sigColor(step.priority.toLowerCase())}">!</div>
      <div class="next-step-body">
        <span class="label" style="color:${sigColor(step.priority.toLowerCase())}">${step.priority.toUpperCase()}</span>
        <p>${escHtml(step.action)}</p>
      </div>
    </li>
  `).join('') + `</ul>`;
  show('section-nextsteps');
}

async function renderAnalysis(data) {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  renderSummary(data);
  await delay(400);

  renderSuspects(data);
  await delay(600);

  renderTimeline(data);
  await delay(400);

  renderInconsistencies(data);
  await delay(300);

  renderEvidence(data);
  await delay(300);

  renderGeographic(data);
  await delay(300);

  renderNextSteps(data);
  await delay(300);

  renderMissing(data);
  await delay(300);

  renderVerdict(data);

  // Scroll to results only after first few sections appear
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}


function show(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = '';
    el.classList.add('fade-in');
  }
}

function hideAll() {
  document.querySelectorAll('.result-section').forEach(el => {
    el.style.display = 'none';
    el.classList.remove('fade-in');
  });
}

function setLoading(loading) {
  const btn = document.getElementById('analyse-btn');
  const spinner = document.getElementById('loading');
  btn.disabled = loading;
  btn.textContent = loading ? "ANALYSING..." : "ANALYSE CASE";
  spinner.style.display = loading ? 'flex' : 'none';
}

function showError(msg) {
  const el = document.getElementById('error-box');
  el.textContent = msg;
  el.style.display = 'block';
}

function clearError() {
  const el = document.getElementById('error-box');
  el.textContent = '';
  el.style.display = 'none';
}

// ─── PRELOADED CASES ─────────────────────────────────────────────────────────
async function loadPreset(file) {
  try {
    const res = await fetch(`cases/${file}`);
    if (!res.ok) throw new Error(`Could not load ${file}`);
    const text = await res.text();
    document.getElementById('case-input').value = text;
  } catch (e) {
    showError(`Failed to load preset: ${e.message}`);
  }
}

// ─── FILE UPLOAD ─────────────────────────────────────────────────────────────
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById('case-input').value = ev.target.result;
  };
  reader.readAsText(file);
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────
async function onAnalyse() {
  const text = document.getElementById('case-input').value.trim();
  if (!text) {
    showError("Please paste a case description or upload a .txt file.");
    return;
  }
  if (text.length < 100) {
    showError("Case text too short. Provide at least a paragraph of detail.");
    return;
  }

  clearError();
  hideAll();
  setLoading(true);

  try {
    const result = await analyseCase(text);
    renderAnalysis(result);
  } catch (err) {
    showError(`Analysis failed: ${err.message}. Check your API key or try again.`);
    console.error(err);
  } finally {
    setLoading(false);
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('analyse-btn').addEventListener('click', onAnalyse);
  document.getElementById('file-upload').addEventListener('change', handleFileUpload);
  document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('file-upload').click();
  });
  document.getElementById('btn-cooper').addEventListener('click', () => loadPreset('db-cooper.txt'));
  document.getElementById('btn-zodiac').addEventListener('click', () => loadPreset('zodiac.txt'));
  document.getElementById('btn-dahlia').addEventListener('click', () => loadPreset('black-dahlia.txt'));

  hideAll();
});