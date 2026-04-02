// Gemini prompt with exact JSON schema
export const buildAnalysisPrompt = (caseText) => `
You are a forensic investigator and criminal psychologist with 30 years of experience.
Analyze the following case and respond ONLY in valid JSON. No markdown, no explanation outside the JSON.

CASE TEXT:
${caseText}

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
`;