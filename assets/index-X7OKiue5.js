(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const v=e=>`
You are a forensic investigator and criminal psychologist with 30 years of experience.
Analyze the following case and respond ONLY in valid JSON. No markdown, no explanation outside the JSON.

CASE TEXT:
${e}

Return this exact JSON structure:
{
  "case_summary": "2-3 sentence overview of the case",
  "timeline": [
    {
      "date": "date or time period",
      "event": "what happened",
      "significance": "high | medium | low"
    }
  ],
  "suspects": [
    {
      "name": "suspect name or Unknown Subject",
      "probability_score": 0,
      "motive": "...",
      "opportunity": "...",
      "evidence_against": ["item 1", "item 2"],
      "evidence_for": ["item 1"],
      "alibi": "alibi or none"
    }
  ],
  "inconsistencies": [
    {
      "description": "what the inconsistency is",
      "severity": "critical | moderate | minor"
    }
  ],
  "evidence": [
    {
      "item": "evidence item name",
      "strength": "strong | weak | missing",
      "notes": "why it matters or what was done wrong"
    }
  ],
  "verdict": {
    "most_likely_scenario": "plain English explanation",
    "confidence_percent": 0,
    "reasoning": "step by step justification"
  },
  "geographic_profile": "Analysis of the killer's probable base of operations or hunting range based on the crime locations.",
  "investigative_next_steps": [
    {
      "priority": "High | Medium | Low",
      "action": "Specific forensic or investigative action to take now"
    }
  ],
  "missing_info": [
    "what investigators should have looked for but did not"
  ]
}
`,h="AIzaSyAhqkpDkoQZ45zHhBcvkD4CfeotV8yxqlE";async function b(e){var l;const t=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${h}`,n=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:v(e)}]}],generationConfig:{responseMimeType:"application/json",temperature:.3,maxOutputTokens:8192}})});if(!n.ok){const d=await n.json().catch(()=>({}));throw new Error(((l=d==null?void 0:d.error)==null?void 0:l.message)||`HTTP ${n.status}`)}const i=(await n.json()).candidates[0];if(i.finishReason==="MAX_TOKENS")throw new Error("Case analysis was too detailed and got cut off (MAX_TOKENS). Try reducing the case text or asking for a shorter summary.");const o=i.content.parts[0].text,c=o.replace(/```json|```/g,"").trim();try{return JSON.parse(c)}catch(d){throw console.error("Raw response:",o),new Error(`Invalid JSON returned from AI: ${d.message}`)}}function r(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function p(e){return e==="high"?"var(--danger)":e==="medium"?"var(--warning)":"var(--muted)"}function E(e){return e==="critical"?"critical":e==="moderate"?"moderate":"minor"}function w(e){return e==="strong"?"badge-strong":e==="weak"?"badge-weak":"badge-missing"}function g(e){return e>70?"var(--danger)":e>=40?"var(--warning)":"var(--success)"}function x(e){const t=document.getElementById("summary-text");t&&(t.textContent=e.case_summary),a("section-summary")}function I(e){const t=document.getElementById("timeline-entries");!t||!e.timeline||(t.innerHTML=e.timeline.map(n=>`
    <div class="timeline-entry">
      <span class="timeline-dot" style="background:${p(n.significance)}"></span>
      <div class="timeline-body">
        <strong class="timeline-date">${r(n.date)}</strong>
        <p class="timeline-event">${r(n.event)}</p>
      </div>
    </div>
  `).join(""),a("section-timeline"))}function $(e){const t=document.getElementById("suspects-grid");if(!t||!e.suspects)return;const n=[...e.suspects].sort((s,i)=>i.probability_score-s.probability_score);t.innerHTML=n.map((s,i)=>`
    <div class="suspect-card" style="border-color:${g(s.probability_score)}">
      <div class="suspect-header">
        <span class="suspect-name">${r(s.name)}</span>
        <span class="suspect-score" style="color:${g(s.probability_score)}">${s.probability_score}%</span>
      </div>
      <div class="suspect-meta">
        <div><span class="label">MOTIVE</span><br>${r(s.motive)}</div>
        <div><span class="label">OPPORTUNITY</span><br>${r(s.opportunity)}</div>
      </div>
      <details class="evidence-toggle">
        <summary>Evidence</summary>
        <div class="evidence-cols">
          <div>
            <div class="label against">Against</div>
            <ul>${(s.evidence_against||[]).map(o=>`<li>${r(o)}</li>`).join("")}</ul>
          </div>
          <div>
            <div class="label for">For</div>
            <ul>${(s.evidence_for||[]).map(o=>`<li>${r(o)}</li>`).join("")}</ul>
          </div>
        </div>
      </details>
      <div class="suspect-alibi"><span class="label">ALIBI</span> ${r(s.alibi)}</div>
    </div>
  `).join(""),a("section-suspects")}function _(e){const t=document.getElementById("inconsistencies-list");!t||!e.inconsistencies||(t.innerHTML=e.inconsistencies.map(n=>`
    <div class="alert-card ${E(n.severity)}">
      <span class="severity-badge">${n.severity.toUpperCase()}</span>
      <p>${r(n.description)}</p>
    </div>
  `).join(""),a("section-inconsistencies"))}function B(e){const t=document.getElementById("evidence-grid");!t||!e.evidence||(t.innerHTML=e.evidence.map(n=>`
    <div class="evidence-card ${n.strength==="missing"?"missing":""}">
      <div class="evidence-item-name">${r(n.item)}</div>
      <span class="badge ${w(n.strength)}">${n.strength.toUpperCase()}</span>
      <p class="evidence-notes">${r(n.notes)}</p>
    </div>
  `).join(""),a("section-evidence"))}function C(e){const t=document.getElementById("missing-list");!t||!e.missing_info||(t.innerHTML=e.missing_info.map(n=>`<li>${r(n)}</li>`).join(""),a("section-missing"))}function L(e){const t=e.verdict;if(!t)return;const n=Math.min(100,Math.max(0,t.confidence_percent)),s=n>=70?"var(--danger)":n>=40?"var(--warning)":"var(--success)",i=document.getElementById("verdict-scenario"),o=document.getElementById("verdict-pct"),c=document.getElementById("verdict-bar-fill"),l=document.getElementById("verdict-reasoning");i&&(i.textContent=t.most_likely_scenario),o&&(o.textContent=n+"%"),c&&(c.style.cssText=`width:${n}%; background:${s}`),l&&(l.textContent=t.reasoning),a("section-verdict")}function k(e){const t=document.getElementById("geo-text");t&&e.geographic_profile&&(t.textContent=e.geographic_profile,a("section-geo"))}function A(e){const t=document.getElementById("next-steps-list");!t||!e.investigative_next_steps||(t.innerHTML="<ul>"+e.investigative_next_steps.map(n=>`
    <li class="next-step-item">
      <div class="next-step-icon" style="color:${p(n.priority.toLowerCase())}">!</div>
      <div class="next-step-body">
        <span class="label" style="color:${p(n.priority.toLowerCase())}">${n.priority.toUpperCase()}</span>
        <p>${r(n.action)}</p>
      </div>
    </li>
  `).join("")+"</ul>",a("section-nextsteps"))}async function T(e){const t=n=>new Promise(s=>setTimeout(s,n));x(e),await t(400),$(e),await t(600),I(e),await t(400),_(e),await t(300),B(e),await t(300),k(e),await t(300),A(e),await t(300),C(e),await t(300),L(e),document.getElementById("results").scrollIntoView({behavior:"smooth"})}function a(e){const t=document.getElementById(e);t&&(t.style.display="",t.classList.add("fade-in"))}function y(){document.querySelectorAll(".result-section").forEach(e=>{e.style.display="none",e.classList.remove("fade-in")})}function f(e){const t=document.getElementById("analyse-btn"),n=document.getElementById("loading");t.disabled=e,t.textContent=e?"ANALYSING...":"ANALYSE CASE",n.style.display=e?"flex":"none"}function u(e){const t=document.getElementById("error-box");t.textContent=e,t.style.display="block"}function S(){const e=document.getElementById("error-box");e.textContent="",e.style.display="none"}async function m(e){try{const t=await fetch(`cases/${e}`);if(!t.ok)throw new Error(`Could not load ${e}`);const n=await t.text();document.getElementById("case-input").value=n}catch(t){u(`Failed to load preset: ${t.message}`)}}function O(e){const t=e.target.files[0];if(!t)return;const n=new FileReader;n.onload=s=>{document.getElementById("case-input").value=s.target.result},n.readAsText(t)}async function N(){const e=document.getElementById("case-input").value.trim();if(!e){u("Please paste a case description or upload a .txt file.");return}if(e.length<100){u("Case text too short. Provide at least a paragraph of detail.");return}S(),y(),f(!0);try{const t=await b(e);T(t)}catch(t){u(`Analysis failed: ${t.message}. Check your API key or try again.`),console.error(t)}finally{f(!1)}}document.addEventListener("DOMContentLoaded",()=>{document.getElementById("analyse-btn").addEventListener("click",N),document.getElementById("file-upload").addEventListener("change",O),document.getElementById("upload-btn").addEventListener("click",()=>{document.getElementById("file-upload").click()}),document.getElementById("btn-cooper").addEventListener("click",()=>m("db-cooper.txt")),document.getElementById("btn-zodiac").addEventListener("click",()=>m("zodiac.txt")),document.getElementById("btn-dahlia").addEventListener("click",()=>m("black-dahlia.txt")),y()});
