import os
import time
from typing import List, Dict, Any, Optional

# Attempt to initialize Firebase Admin SDK in Python
firebase_active = False
db = None

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    # Path to firebase credentials or use default
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        firebase_active = True
        print("[FIREBASE] Python Admin SDK initialized successfully.")
    else:
        # Try default credential loading
        firebase_admin.initialize_app()
        db = firestore.client()
        firebase_active = True
        print("[FIREBASE] Python Admin SDK initialized with default application credentials.")
except Exception as e:
    print(f"[FIREBASE] Skipping Python Firebase Admin initialization ({str(e)}). Running in high-fidelity mock RAM memory database mode.")

# Static RAM backups (identical to MOCK data to allow seamless out-of-the-box operation)
MEMORY_ISSUES: List[Dict[str, Any]] = [
  {
    "id": "issue1",
    "title": "Hazardous Deep Pothole on Oak Street",
    "category": "Road Damage",
    "description": "Deep, axle-shattering pothole in the middle of the active lane right outside 1400 Oak Street. Cars are swerving dangerously into oncoming traffic to avoid it. Getting larger after the heavy rain yesterday.",
    "location": {
      "lat": 37.7712,
      "lng": -122.4285,
      "address": "1400 Oak St, San Francisco, CA 94117",
      "ward": "Ward 5 (Haight-Ashbury)"
    },
    "severity": "High",
    "status": "in_progress",
    "reporter": {
      "id": "citizen1",
      "name": "Alex Rivera",
      "email": "alex.rivera@civichero.org"
    },
    "votes": ["citizen1", "user2", "user3", "user4"],
    "verifications": [
      {
        "id": "v1",
        "userId": "verifier1",
        "userName": "Elena Rostova",
        "comment": "I live near Oak street. Visited the site and verified this pothole is indeed extremely dangerous, about 8 inches deep and full of water. Definitely high priority.",
        "status": "verified",
        "createdAt": "2026-06-21T14:30:00Z"
      }
    ],
    "comments": [
      {
        "id": "c1",
        "userId": "officer1",
        "userName": "Chief Marcus Thorne",
        "userRole": "officer",
        "text": "Public Works team has been assigned for cold-patch repair. Work order #PW-99214 created.",
        "createdAt": "2026-06-22T08:15:00Z"
      }
    ],
    "assignedDepartment": "Department of Public Works",
    "assignedTo": "Chief Marcus Thorne",
    "aiAnalysis": {
      "detectedIssues": ["Pothole", "Asphalt fracture", "Road water logging"],
      "visionSeverity": "High",
      "visionConfidence": 0.94,
      "visibleDamage": "Concrete failure in high-traffic commercial zone, depth exceeding 8 inches, structure deterioration in adjacent lane.",
      "recommendedDepartment": "Public Works - Roads Maintenance Division",
      "classifiedTitle": "Hazardous Deep Pothole on Oak Street",
      "classifiedCategory": "Roads & Transit",
      "classifiedDescription": "Significant circular crater in road structure at 1400 Oak St, posing direct collision risks.",
      "classifiedPriority": "High",
      "isDuplicate": False,
      "riskLevel": "High",
      "affectedCitizensEstimate": 850,
      "escalationProbability": 75,
      "longTermRiskSummary": "Swerving vehicles could cause high-velocity front-end collisions. Sub-base erosion may expand the defect, potentially undermining the sewer main located directly underneath.",
      "priorityScore": 89,
      "repairApproach": "Excavate surrounding cracked sub-base, compact sub-grade, fill with warm-mix dense aggregate asphalt, and seal-coat joints.",
      "temporaryMitigation": "Erect immediate high-reflectivity safety cones and flashing high-hazard warning barrier.",
      "estimatedCost": "$350 - $550",
      "estimatedResolutionDays": 3
    },
    "createdAt": "2026-06-20T11:22:00Z",
    "updatedAt": "2026-06-22T08:15:00Z"
  },
  {
    "id": "issue2",
    "title": "Sewer/Water Main Burst Flooding",
    "category": "Water Leakage",
    "description": "Water is shooting up from the sidewalk joint next to the stormwater drain on 24th Street. It has completely flooded the pedestrian crosswalk and is starting to wash away garden bed soil.",
    "location": {
      "lat": 37.7523,
      "lng": -122.4138,
      "address": "3200 24th St, San Francisco, CA 94110",
      "ward": "Ward 9 (Mission District)"
    },
    "severity": "Critical",
    "status": "verified",
    "reporter": {
      "id": "verifier1",
      "name": "Elena Rostova",
      "email": "elena.rust@civichero.org"
    },
    "votes": ["verifier1", "citizen1", "user5", "user6"],
    "verifications": [],
    "comments": [],
    "assignedDepartment": "Water & Sewerage Authority",
    "aiAnalysis": {
      "detectedIssues": ["Water pipe leakage", "Sidewalk erosion", "Crosswalk flooding"],
      "visionSeverity": "Critical",
      "visionConfidence": 0.98,
      "visibleDamage": "Major potable water main breach, substantial structural water pooling, rapid soil sub-grade washaway.",
      "recommendedDepartment": "Water Operations - Emergency Services",
      "classifiedTitle": "Sewer/Water Main Burst Flooding",
      "classifiedCategory": "Water & Sanitation",
      "classifiedDescription": "High-pressure utility eruption on pedestrian walkway, actively submerging neighborhood sidewalks.",
      "classifiedPriority": "Critical",
      "isDuplicate": False,
      "riskLevel": "Critical",
      "affectedCitizensEstimate": 2400,
      "escalationProbability": 95,
      "longTermRiskSummary": "Water logging will induce sinkholes on the pavement within 7 days. Low municipal water pressure in Ward 9 high-rises and severe soil subsidence around utility poles are imminent.",
      "priorityScore": 97,
      "repairApproach": "Shut main valve, isolate the affected section, core-drill the sidewalk concrete, repair the 4-inch ductile iron pipe sleeve, backfill with gravel, repave sidewalk.",
      "temporaryMitigation": "Urgent primary shutoff of regional valve, barricade flooded sidewalks, and steer runoff into high-capacity sewer inlets.",
      "estimatedCost": "$1,800 - $3,200",
      "estimatedResolutionDays": 1
    },
    "createdAt": "2026-06-22T18:30:00Z",
    "updatedAt": "2026-06-23T00:10:00Z"
  }
]

MEMORY_USERS: Dict[str, Dict[str, Any]] = {
  "citizen1": {
    "id": "citizen1",
    "name": "Alex Rivera",
    "email": "alex.rivera@civichero.org",
    "role": "citizen",
    "points": 175,
    "reportsCount": 4,
    "verificationsCount": 5,
    "currentBadge": "🥉 Local Reporter",
    "joinedAt": "2026-01-15T10:00:00Z"
  },
  "verifier1": {
    "id": "verifier1",
    "name": "Elena Rostova",
    "email": "elena.rust@civichero.org",
    "role": "verifier",
    "points": 850,
    "reportsCount": 12,
    "verificationsCount": 42,
    "currentBadge": "🥈 Community Guardian",
    "joinedAt": "2025-11-01T08:30:00Z"
  },
  "admin1": {
    "id": "admin1",
    "name": "ruthikareddy09",
    "email": "ruthikareddy09@gmail.com",
    "role": "admin",
    "points": 2500,
    "reportsCount": 35,
    "verificationsCount": 120,
    "currentBadge": "🏆 Community Champion",
    "joinedAt": "2025-05-10T12:00:00Z"
  }
}

MEMORY_QUESTS: List[Dict[str, Any]] = [
  {
    "id": "q1",
    "title": "Pothole Patrol",
    "description": "Report 2 pothole issues in any ward to help public works teams deploy faster patching crews.",
    "points": 150,
    "targetCount": 2,
    "currentCount": 1,
    "type": "report",
    "completed": False
  },
  {
    "id": "q2",
    "title": "Eco Guardian",
    "description": "Verify 3 illegal garbage dump sights anywhere in the district to accelerate clear-out sweeps.",
    "points": 200,
    "targetCount": 3,
    "currentCount": 2,
    "type": "verify",
    "completed": False
  }
]

MEMORY_HEALTH: List[Dict[str, Any]] = [
  {
    "ward": "Ward 5 (Haight-Ashbury)",
    "overall": 73,
    "roads": 65,
    "lighting": 82,
    "cleanliness": 55,
    "water": 78,
    "safety": 85,
    "analyzedAt": "2026-06-22T00:00:00Z",
    "aiDiagnostic": "Cleanliness issues (illegal dump heaps) in Golden Gate buffers represent the chief vulnerability here. Power grids are stable."
  },
  {
    "ward": "Ward 9 (Mission District)",
    "overall": 59,
    "roads": 58,
    "lighting": 64,
    "cleanliness": 49,
    "water": 45,
    "safety": 79,
    "analyzedAt": "2026-06-22T00:00:00Z",
    "aiDiagnostic": "A critical drinking main burst has significantly eroded nearby sidewalk segments. Prompt replacement is recommended."
  }
]

def get_db_issues() -> List[Dict[str, Any]]:
    if firebase_active:
        docs = db.collection("issues").stream()
        return [doc.to_dict() for doc in docs]
    return MEMORY_ISSUES

def create_db_issue(issue_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    if firebase_active:
        db.collection("issues").document(issue_id).set(data)
        return data
    MEMORY_ISSUES.append(data)
    return data

def verify_db_issue(issue_id: str, user_id: str, comment: str, status: str) -> Optional[Dict[str, Any]]:
    current_time = str(time.strftime('%Y-%m-%dT%H:%M:%SZ'))
    verification = {
        "id": f"v_{int(time.time()*1000)}",
        "userId": user_id,
        "userName": MEMORY_USERS.get(user_id, {}).get("name", "Field Verifier"),
        "comment": comment,
        "status": status,
        "createdAt": current_time
    }
    
    if firebase_active:
        doc_ref = db.collection("issues").document(issue_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None
        issue_data = doc.to_dict()
        issue_data["verifications"].append(verification)
        if issue_data["status"] == "reported":
            issue_data["status"] = "verified"
        issue_data["updatedAt"] = current_time
        doc_ref.set(issue_data)
        return issue_data
    else:
        for idx, issue in enumerate(MEMORY_ISSUES):
            if issue["id"] == issue_id:
                issue["verifications"].append(verification)
                if issue["status"] == "reported":
                    issue["status"] = "verified"
                issue["updatedAt"] = current_time
                MEMORY_ISSUES[idx] = issue
                return issue
    return None

def vote_db_issue(issue_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    # Toggles standard vote
    current_time = str(time.strftime('%Y-%m-%dT%H:%M:%SZ'))
    if firebase_active:
        doc_ref = db.collection("issues").document(issue_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None
        issue_data = doc.to_dict()
        votes = issue_data["votes"]
        if user_id in votes:
            votes.remove(user_id)
        else:
            votes.append(user_id)
        issue_data["votes"] = votes
        issue_data["updatedAt"] = current_time
        doc_ref.set(issue_data)
        return issue_data
    else:
        for idx, issue in enumerate(MEMORY_ISSUES):
            if issue["id"] == issue_id:
                votes = issue["votes"]
                if user_id in votes:
                    votes.remove(user_id)
                else:
                    votes.append(user_id)
                issue["votes"] = votes
                issue["updatedAt"] = current_time
                MEMORY_ISSUES[idx] = issue
                return issue
    return None

def add_db_comment(issue_id: str, user_id: str, text: str) -> Optional[Dict[str, Any]]:
    current_time = str(time.strftime('%Y-%m-%dT%H:%M:%SZ'))
    user = MEMORY_USERS.get(user_id, {"name": "Alex Rivera", "role": "citizen"})
    comment = {
        "id": f"c_{int(time.time()*1000)}",
        "userId": user_id,
        "userName": user.get("name"),
        "userRole": user.get("role"),
        "text": text,
        "createdAt": current_time
    }
    
    if firebase_active:
        doc_ref = db.collection("issues").document(issue_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None
        issue_data = doc.to_dict()
        issue_data["comments"].append(comment)
        issue_data["updatedAt"] = current_time
        doc_ref.set(issue_data)
        return issue_data
    else:
        for idx, issue in enumerate(MEMORY_ISSUES):
            if issue["id"] == issue_id:
                issue["comments"].append(comment)
                issue["updatedAt"] = current_time
                MEMORY_ISSUES[idx] = issue
                return issue
    return None

def update_db_issue_status(issue_id: str, status: str, operator_id: str, message: Optional[str]) -> Optional[Dict[str, Any]]:
    current_time = str(time.strftime('%Y-%m-%dT%H:%M:%SZ'))
    user = MEMORY_USERS.get(operator_id, {"name": "Chief Marcus Thorne", "role": "officer"})
    
    comment = {
        "id": f"sys_{int(time.time()*1000)}",
        "userId": operator_id,
        "userName": user.get("name"),
        "userRole": user.get("role"),
        "text": message or f"Status updated to [{status.upper()}] by supervisory operations.",
        "createdAt": current_time
    }
    
    if firebase_active:
        doc_ref = db.collection("issues").document(issue_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None
        issue_data = doc.to_dict()
        issue_data["status"] = status
        issue_data["comments"].append(comment)
        issue_data["updatedAt"] = current_time
        doc_ref.set(issue_data)
        return issue_data
    else:
        for idx, issue in enumerate(MEMORY_ISSUES):
            if issue["id"] == issue_id:
                issue["status"] = status
                issue["comments"].append(comment)
                issue["updatedAt"] = current_time
                MEMORY_ISSUES[idx] = issue
                return issue
    return None

def get_db_leaderboard() -> List[Dict[str, Any]]:
    raw_users = []
    if firebase_active:
        user_docs = db.collection("users").stream()
        raw_users = [d.to_dict() for d in user_docs]
    else:
        raw_users = list(MEMORY_USERS.values())
        
    sorted_users = sorted(raw_users, key=lambda x: x.get("points", 0), reverse=True)
    leaderboard = []
    for idx, u in enumerate(sorted_users):
        leaderboard.append({
            "id": u["id"],
            "name": u["name"],
            "points": u["points"],
            "badge": u.get("currentBadge", "🥉 Local Reporter"),
            "reportsCount": u.get("reportsCount", 0),
            "verificationsCount": u.get("verificationsCount", 0),
            "rank": idx + 1
        })
    return leaderboard

def get_db_quests() -> List[Dict[str, Any]]:
    if firebase_active:
        docs = db.collection("quests").stream()
        return [doc.to_dict() for doc in docs]
    return MEMORY_QUESTS

def get_db_health_scores() -> List[Dict[str, Any]]:
    if firebase_active:
        docs = db.collection("health_scores").stream()
        return [doc.to_dict() for doc in docs]
    return MEMORY_HEALTH

def save_health_score(ward_name: str, score_data: Dict[str, Any]):
    score_data["ward"] = ward_name
    score_data["analyzedAt"] = str(time.strftime('%Y-%m-%dT%H:%M:%SZ'))
    if firebase_active:
        db.collection("health_scores").document(ward_name).set(score_data)
    else:
        for idx, hs in enumerate(MEMORY_HEALTH):
            if hs["ward"] == ward_name:
                MEMORY_HEALTH[idx] = score_data
                return
        MEMORY_HEALTH.append(score_data)

def recalculate_user_points(user_id: str, action: str):
    user = MEMORY_USERS.get(user_id)
    if not user:
        return
    
    if action == "report":
        user["points"] += 50
        user["reportsCount"] += 1
    elif action == "verify":
        user["points"] += 25
        user["verificationsCount"] += 1
    elif action == "vote":
        user["points"] += 5
        
    # Recalculate Badges
    pts = user["points"]
    if pts >= 2000:
        user["currentBadge"] = "🏆 Community Champion"
    elif pts >= 1000:
        user["currentBadge"] = "🥇 Civic Hero"
    elif pts >= 400:
        user["currentBadge"] = "🥈 Community Guardian"
    else:
        user["currentBadge"] = "🥉 Local Reporter"
        
    MEMORY_USERS[user_id] = user
    if firebase_active:
        db.collection("users").document(user_id).set(user)
