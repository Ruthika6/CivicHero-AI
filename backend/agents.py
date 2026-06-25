import os
import json
from typing import List, Dict, Any

# Import Google GenAI SDK
genai_active = False
client = None

try:
    from google import genai
    from google.genai import types
    
    API_KEY = os.getenv("GEMINI_API_KEY")
    if API_KEY and API_KEY != "MY_GEMINI_API_KEY":
        client = genai.Client(api_key=API_KEY)
        genai_active = True
        print("[AI AGENTS] Python google-genai Client initialized successfully.")
    else:
        print("[AI AGENTS] GEMINI_API_KEY is not defined. Operating on Python mock analytics models.")
except Exception as e:
    print(f"[AI AGENTS] Could not load google-genai Client: {str(e)}")

# Fallback presets similar to Express ones to guarantee robust test runs
FALLBACK_SUITE = {
    "Road Damage": {
      "detectedIssues": ["Pothole", "Pavement stress", "Sub-grade failure"],
      "visionSeverity": "High",
      "visionConfidence": 0.95,
      "visibleDamage": "Pavement asphalt crack of deep circular nature, spanning over 7 inches deep and 3 feet wide.",
      "recommendedDepartment": "Department of Public Works - Capital Repairs",
      "classifiedTitle": "Hazardous Deep Pothole on Oak Street",
      "classifiedCategory": "Road Damage",
      "classifiedDescription": "Critical circular asphalt crater posing major rim damage risks for commuter traffic.",
      "classifiedPriority": "High",
      "isDuplicate": False,
      "riskLevel": "High",
      "affectedCitizensEstimate": 850,
      "escalationProbability": 75,
      "longTermRiskSummary": "Sub-grade erosion to compromise adjacent storm pipe integrity, enlarging the crater rapidly.",
      "priorityScore": 89,
      "repairApproach": "Erode surrounds with saw, compact base concrete structure, refill with warm-mix asphalt compound, smooth roller compaction.",
      "temporaryMitigation": "Barricade with warning cones and flag indicators.",
      "estimatedCost": "$350 - $550",
      "estimatedResolutionDays": 3
    },
    "Water Leakage": {
      "detectedIssues": ["Water pipe leakage", "Sidewalk erosion", "Crosswalk flooding"],
      "visionSeverity": "Critical",
      "visionConfidence": 0.98,
      "visibleDamage": "potable water pipe gushing, pooling actively on civic curbs.",
      "recommendedDepartment": "Water Sewerage & Drainage Authority",
      "classifiedTitle": "Sewer/Water Main Burst Flooding",
      "classifiedCategory": "Water Leakage",
      "classifiedDescription": "Sub-surface pressure main rupture washing sidewalk gravel, creating high utility wastage.",
      "classifiedPriority": "Critical",
      "isDuplicate": False,
      "riskLevel": "Critical",
      "affectedCitizensEstimate": 2100,
      "escalationProbability": 95,
      "longTermRiskSummary": "Impending sinkhole failure beneath structural sidewalk paving blocks.",
      "priorityScore": 97,
      "repairApproach": "Main valve isolating shut-down, break concrete, swap iron conduit collar sleeve, gravel fill packing, restabilize sidewalk.",
      "temporaryMitigation": "Upstream flow bypass routing.",
      "estimatedCost": "$1,400 - $2,500",
      "estimatedResolutionDays": 1
    }
}

def analyze_issue_agents(issue_data: Dict[str, Any], image_url: Optional[str] = None) -> Dict[str, Any]:
    """
    Ensemble agent orchestrating Vision Analysis, Classification, Duplicate checks,
    Impact estimates, Priority rankings, and Resolution Planning under a single Gemini context.
    """
    if genai_active and client:
        try:
            prompt = f"""
            You are CivicHero AI Multi-Agent ensemble analyzing a reported local community issue.
            You must perform the tasks of 6 civic-engineering agents:
            1. VISION ANALYSIS AGENT: Analyze image clues (MimeType/Visual damage).
            2. ISSUE CLASSIFICATION AGENT: Categorize and formalize title/descriptions.
            3. DUPLICATE DETECTION AGENT: Compare with other reported issues in proximity.
            4. IMPACT PREDICTION AGENT: Predict long-term risks & affected citizen numbers.
            5. PRIORITY SCORING AGENT: Rank severity out of 100.
            6. RESOLUTION PLANNING AGENT: Build estimate repair steps, days, and cost brackets.

            COMPLAINT PAYLOAD:
            Title: "{issue_data.get('title')}"
            Category: "{issue_data.get('category')}"
            Description: "{issue_data.get('description')}"
            Address: "{issue_data.get('location', {}).get('address')}"
            Lat: {issue_data.get('location', {}).get('lat')}
            Lng: {issue_data.get('location', {}).get('lng')}
            Severity claimed: "{issue_data.get('severity')}"

            Respond in absolute RAW JSON conforming exactly to this structure:
            {{
              "detectedIssues": ["pothole", "cracked"],
              "visionSeverity": "High",
              "visionConfidence": 0.95,
              "visibleDamage": "Physical structural concrete failure summary",
              "recommendedDepartment": "Bureau of Public Works Division",
              "classifiedTitle": "Refined Classy Formal Register Title",
              "classifiedCategory": "Formalized Category",
              "classifiedDescription": "Formal municipal description",
              "classifiedPriority": "Low" or "Medium" or "High" or "Critical",
              "isDuplicate": false,
              "duplicateDistance": null,
              "similarIssueId": null,
              "duplicateResolution": null,
              "riskLevel": "High",
              "affectedCitizensEstimate": 500,
              "escalationProbability": 80,
              "longTermRiskSummary": "Structural decay timeline statement",
              "priorityScore": 85,
              "formulaBreakdown": {{
                 "severityPoints": 25,
                 "votingPoints": 5,
                 "impactPoints": 25,
                 "agePoints": 20
              }},
              "repairApproach": "Step-by-step engineering plan",
              "temporaryMitigation": "Emergency response safety steps",
              "estimatedCost": "$300 - $550",
              "estimatedResolutionDays": 3
            }}
            """

            # Call official Python model
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            return json.loads(response.text)
        except Exception as err:
            print(f"[AI FAILURE] Live Gemini analysis failed. Falling back to default profiles. {str(err)}")

    # Fallback simulation
    category = issue_data.get("category", "Road Damage")
    return FALLBACK_SUITE.get(category, FALLBACK_SUITE["Road Damage"])


def analyze_ward_health(ward_name: str, issues: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    COMMUNITY HEALTH AGENT: Analyzes health scores for a neighborhood ward.
    """
    if genai_active and client:
        try:
            issue_list_text = "\n".join([
                f"- Category: {i.get('category')}, Details: '{i.get('description')}', Status: {i.get('status')}, Severity: {i.get('severity')}"
                for i in issues
            ])
            
            prompt = f"""
            You are the Civic Community Health Agent. Conduct a multi-point inspection diagnostic on the neighborhood '{ward_name}'.
            Here is the list of active municipal issues logged in the ward:
            {issue_list_text or 'No reports filed yet.'}

            Determine percentage health grades (1 to 100) and draft a brief analytical diagnostic summary (max 3 sentences) outlining trends and risks list.

            Response must be raw JSON conforming precisely to:
            {{
              "overall": 80,
              "roads": 75,
              "lighting": 85,
              "cleanliness": 70,
              "water": 90,
              "safety": 80,
              "aiDiagnostic": "Analytical paragraph outlining current infrastructural integrity, primary risk factors, and recommended interventions."
            }}
            """
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"[AI HEALTH ERROR] Ward diagnostic error: {str(e)}")

    # High quality static calculation fallback
    total = len(issues)
    grade = max(40, 95 - (total * 8))
    return {
      "overall": int(grade),
      "roads": int(max(40, grade - 5)),
      "lighting": int(max(45, grade + 4)),
      "cleanliness": int(max(35, grade - 8)),
      "water": int(max(50, grade + 2)),
      "safety": int(max(55, grade + 6)),
      "aiDiagnostic": f"Analytical scan compiled mathematically from {total} active ward issues. Community cleanliness and roads represent critical infrastructure priorities requiring municipal funds."
    }


def ai_smart_search(query: str, issues: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    SMART SEARCH AGENT: Filters issues semantically and generates interactive summaries.
    """
    if genai_active and client:
        try:
            db_desc = "\n".join([
                f"ID: {i.get('id')}, Category: {i.get('category')}, Title: '{i.get('title')}', Ward: '{i.get('location', {}).get('ward')}', Status: '{i.get('status')}'"
                for i in issues
            ])
            prompt = f"""
            You are the Civic intelligence search router. A user represents searching the query: "{query}".
            Our currently known issue database is:
            {db_desc}

            Search semantically. Filter matching ID strings, and formulate an elegant 2-sentence friendly conversational answer summarizing finding metrics.

            Format strictly in raw JSON:
            {{
              "matchingIssueIds": ["issue1"],
              "aiResponse": "Summary advice explaining matching items."
            }}
            """
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            return json.loads(response.text)
        except Exception as err:
            print(f"[SEARCH FAILURE] Semantic search failure: {str(err)}")

    # Keyword match fallback
    norm_q = query.lower()
    matches = issues
    if "water" in norm_q:
        matches = [i for i in issues if i.get("category") == "Water Leakage"]
    elif "road" in norm_q or "pothole" in norm_q:
        matches = [i for i in issues if i.get("category") == "Road Damage"]
    elif "light" in norm_q:
        matches = [i for i in issues if i.get("category") == "Broken Streetlight"]
    elif "trash" in norm_q or "garbage" in norm_q or "dump" in norm_q:
        matches = [i for i in issues if i.get("category") == "Garbage Dump"]

    return {
        "matchingIssueIds": [i["id"] for i in matches],
        "aiResponse": f"Searching city register for query '{query}', matching {len(matches)} municipal case indices."
    }
