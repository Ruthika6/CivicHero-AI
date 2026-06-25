import os
import time
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Import Pydantic models & configurations
from schemas import (
    IssueCreate, IssueResponse, VerifyPayload, VotePayload, 
    CommentPayload, StatusChangePayload, AIAnalysisResponse, 
    LeaderboardResponse, RewardsQuestResponse, CommunityHealthResponse, 
    SmartSearchResponse
)
from db import (
    db, get_db_issues, create_db_issue, verify_db_issue, 
    vote_db_issue, add_db_comment, update_db_issue_status, 
    get_db_leaderboard, get_db_quests, get_db_health_scores,
    recalculate_user_points, save_health_score
)
from agents import (
    analyze_issue_agents, 
    analyze_ward_health, 
    ai_smart_search
)

app = FastAPI(
    title="CivicHero AI – Hyperlocal Community Problem Solver Backend",
    description="Intelligent Epicenter Engine powered by Python, FastAPI, Firestore, and official Google Gemini 2.5/3.5 models.",
    version="1.0.0"
)

# Enable CORS for frontend Vite development server interactions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication & Middleware
# Authentic Firebase token checks would normally reside here. 
# We maintain direct path payloads with user IDs for the hackathon prototype.

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "CivicHero AI Core Engine",
        "engine": "FastAPI + Python 3.11",
        "agents": "Ensemble 7-Agent System Active (Vision, Classification, Duplication, Impact, Priority, Planning, Health)"
    }

# 1. Fetch Issues
@app.get("/api/issues", response_model=List[Dict[str, Any]])
async def get_issues(category: Optional[str] = None, status: Optional[str] = None):
    try:
        issues_list = get_db_issues()
        if category:
            issues_list = [i for i in issues_list if i.get("category") == category]
        if status:
            issues_list = [i for i in issues_list if i.get("status") == status]
        return issues_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Retrieval Failed: {str(e)}")

# 2. Report Issue (Triggers 6 AI agents synchronously through Gemini)
@app.post("/api/issues", response_model=Dict[str, Any])
async def report_issue(payload: IssueCreate):
    try:
        # Create initial raw issue structure
        current_time = int(time.time() * 1000)
        issue_id = f"issue_{current_time}"
        
        issue_data = {
            "id": issue_id,
            "title": payload.title,
            "category": payload.category,
            "description": payload.description,
            "location": payload.location.dict(),
            "severity": payload.severity,
            "status": "reported",
            "reporter": payload.reporter.dict(),
            "votes": [payload.reporter.id], # Auto upvote by creator
            "verifications": [],
            "comments": [],
            "imageUrl": payload.imageUrl or "",
            "voiceUrl": payload.voiceUrl or "",
            "assignedDepartment": "Assigned Department Agent",
            "assignedTo": None,
            "createdAt": payload.createdAt or str(time.strftime('%Y-%m-%dT%H:%M:%SZ')),
            "updatedAt": str(time.strftime('%Y-%m-%dT%H:%M:%SZ'))
        }

        # Select basic department fallback based on category
        category_dept_map = {
            "Road Damage": "Department of Public Works",
            "Water Leakage": "Water & Sewerage Authority",
            "Broken Streetlight": "Bureau of Street Lighting",
            "Garbage Dump": "Sanitation & Waste Services Bureau",
            "Environmental": "Environmental Protection Bureau",
            "Public Safety": "Civic Security Division"
        }
        issue_data["assignedDepartment"] = category_dept_map.get(payload.category, "General Municipal Services")

        # Run Ensemble AI Agent pipeline (Vision, Classify, Duplicate, Impact, Priority, Resolution Planning)
        print(f"[FASTAPI] Initiating multi-agent analysis for reported issue: '{payload.title}'")
        ai_diagnostics = analyze_issue_agents(issue_data, payload.imageUrl)
        
        issue_data["aiAnalysis"] = ai_diagnostics
        
        # Override fields with elegant AI Classified refinements
        if ai_diagnostics.get("classifiedTitle"):
            issue_data["title"] = ai_diagnostics["classifiedTitle"]
        if ai_diagnostics.get("classifiedPriority"):
            issue_data["severity"] = ai_diagnostics["classifiedPriority"]
        if ai_diagnostics.get("recommendedDepartment"):
            issue_data["assignedDepartment"] = ai_diagnostics["recommendedDepartment"]

        # Save to Firestore and award user points
        created_issue = create_db_issue(issue_id, issue_data)
        
        # Recalculate reporter points & progress quests in Firestore
        recalculate_user_points(payload.reporter.id, "report")

        return created_issue
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# 3. Verify on Ground (Verifiers upvote verification and add testimony)
@app.post("/api/issues/{id}/verify")
async def verify_issue(id: str, payload: VerifyPayload):
    try:
        updated_issue = verify_db_issue(
            issue_id=id,
            user_id=payload.userId,
            comment=payload.comment,
            status=payload.status
        )
        if not updated_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        
        # Reward verifier point metrics
        recalculate_user_points(payload.userId, "verify")
        return updated_issue
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

# 4. Vote on Severity / Upvote
@app.post("/api/issues/{id}/vote")
async def vote_issue(id: str, payload: VotePayload):
    try:
        updated_issue = vote_db_issue(issue_id=id, user_id=payload.userId)
        if not updated_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        recalculate_user_points(payload.userId, "vote")
        return updated_issue
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

# 5. Comment / Operation Logs
@app.post("/api/issues/{id}/comment")
async def add_comment(id: str, payload: CommentPayload):
    try:
        updated_issue = add_db_comment(
            issue_id=id,
            user_id=payload.userId,
            text=payload.text
        )
        if not updated_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        return updated_issue
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

# 6. Authority Status Updates
@app.post("/api/issues/{id}/status")
async def update_status(id: str, payload: StatusChangePayload):
    try:
        updated_issue = update_db_issue_status(
            issue_id=id,
            status=payload.status,
            operator_id=payload.operatorId,
            message=payload.message
        )
        if not updated_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        return updated_issue
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

# 7. AI Community Health Diagnoser (Analyzes Ward status)
@app.post("/api/ai/health-diagnose", response_model=CommunityHealthResponse)
async def health_diagnose_ward(ward_name: str = Body(..., embed=True)):
    try:
        ward_issues = [i for i in get_db_issues() if i.get("location", {}).get("ward") == ward_name]
        ai_scores = analyze_ward_health(ward_name, ward_issues)
        
        # Save analysis score block
        save_health_score(ward_name, ai_scores)
        return ai_scores
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 8. AI Smart Semantic Search
@app.post("/api/ai/smart-search", response_model=SmartSearchResponse)
async def smart_search(query: str = Body(..., embed=True)):
    try:
        db_issues = get_db_issues()
        response = ai_smart_search(query, db_issues)
        return response
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

# 9. Leaderboard Stats
@app.get("/api/leaderboard", response_model=List[LeaderboardResponse])
async def get_leaderboard():
    return get_db_leaderboard()

# 10. Quests
@app.get("/api/quests", response_model=List[RewardsQuestResponse])
async def get_quests():
    return get_db_quests()

# 11. Ward Health Scores
@app.get("/api/health-scores", response_model=List[CommunityHealthResponse])
async def get_health_scores():
    return get_db_health_scores()

if __name__ == "__main__":
    import uvicorn
    # Bind to port 3000 when deployed independently
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
