from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LocationSchema(BaseModel):
    lat: float = Field(..., description="Latitude coordinate")
    lng: float = Field(..., description="Longitude coordinate")
    address: str = Field(..., description="Aesthetic street address")
    ward: str = Field(..., description="Assigned neighborhood ward")

class ReporterSchema(BaseModel):
    id: str
    name: str
    email: str

class IssueCreate(BaseModel):
    title: str
    category: str
    description: str
    location: LocationSchema
    severity: str = "Medium"
    reporter: ReporterSchema
    imageUrl: Optional[str] = None
    voiceUrl: Optional[str] = None
    createdAt: Optional[str] = None

class VerificationDetailSchema(BaseModel):
    id: str
    userId: str
    userName: str
    comment: str
    status: str
    createdAt: str

class CommentDetailSchema(BaseModel):
    id: str
    userId: str
    userName: str
    userRole: str
    text: str
    createdAt: str

class AIAnalysisResponse(BaseModel):
    detectedIssues: List[str]
    visionSeverity: str
    visionConfidence: float
    visibleDamage: str
    recommendedDepartment: str
    classifiedTitle: str
    classifiedCategory: str
    classifiedDescription: str
    classifiedPriority: str
    isDuplicate: bool
    duplicateDistance: Optional[float] = None
    similarIssueId: Optional[str] = None
    duplicateResolution: Optional[str] = None
    riskLevel: str
    affectedCitizensEstimate: int
    escalationProbability: int
    longTermRiskSummary: str
    priorityScore: int
    repairApproach: str
    temporaryMitigation: str
    estimatedCost: str
    estimatedResolutionDays: int

class IssueResponse(BaseModel):
    id: str
    title: str
    category: str
    description: str
    location: LocationSchema
    severity: str
    status: str
    reporter: ReporterSchema
    votes: List[str]
    verifications: List[VerificationDetailSchema]
    comments: List[CommentDetailSchema]
    imageUrl: Optional[str] = None
    voiceUrl: Optional[str] = None
    assignedDepartment: Optional[str] = None
    assignedTo: Optional[str] = None
    aiAnalysis: Optional[AIAnalysisResponse] = None
    createdAt: str
    updatedAt: str

class VerifyPayload(BaseModel):
    userId: str
    comment: str
    status: str = "verified"

class VotePayload(BaseModel):
    userId: str

class CommentPayload(BaseModel):
    userId: str
    text: str

class StatusChangePayload(BaseModel):
    status: str
    operatorId: str
    message: Optional[str] = None

class LeaderboardResponse(BaseModel):
    id: str
    name: str
    points: int
    badge: str
    reportsCount: int
    verificationsCount: int
    rank: int

class RewardsQuestResponse(BaseModel):
    id: str
    title: str
    description: str
    points: int
    targetCount: int
    currentCount: int
    type: str
    completed: bool

class CommunityHealthResponse(BaseModel):
    ward: str
    overall: int
    roads: int
    lighting: int
    cleanliness: int
    water: int
    safety: int
    aiDiagnostic: str
    analyzedAt: str

class SmartSearchResponse(BaseModel):
    matchingIssueIds: List[str]
    aiResponse: str
