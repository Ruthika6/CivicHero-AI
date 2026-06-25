export type UserRole = "citizen" | "verifier" | "admin" | "officer";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  reportsCount: number;
  verificationsCount: number;
  badges: string[];
  currentBadge: string;
  joinedAt: string;
}

export interface VerificationDetail {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  status: "verified" | "disputed";
  createdAt: string;
}

export interface CommentDetail {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  createdAt: string;
}

export interface AIAnalysis {
  // Vision Analysis
  detectedIssues?: string[];
  visionSeverity?: "Low" | "Medium" | "High" | "Critical";
  visionConfidence?: number;
  visibleDamage?: string;
  recommendedDepartment?: string;

  // Issue Classification
  classifiedTitle?: string;
  classifiedCategory?: string;
  classifiedDescription?: string;
  classifiedPriority?: "Low" | "Medium" | "High" | "Critical";

  // Duplicate Check
  isDuplicate?: boolean;
  duplicateDistance?: number;
  similarIssueId?: string;
  duplicateResolution?: string;

  // Impact Prediction
  riskLevel?: "Low" | "Medium" | "High" | "Critical";
  affectedCitizensEstimate?: number;
  escalationProbability?: number; // 0 to 100
  longTermRiskSummary?: string;

  // Priority Scoring
  priorityScore?: number; // 0 to 100
  formulaBreakdown?: {
    severityPoints: number;    // max 30
    votingPoints: number;      // max 20
    impactPoints: number;      // max 30
    agePoints: number;         // max 20
  };

  // Resolution Planning
  repairApproach?: string;
  temporaryMitigation?: string;
  estimatedCost?: string;
  estimatedResolutionDays?: number;
}

export interface CommunityIssue {
  id: string;
  title: string;
  category: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward: string;
  };
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "reported" | "verified" | "assigned" | "in_progress" | "resolved";
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  votes: string[]; // List of user IDs who voted
  verifications: VerificationDetail[];
  comments: CommentDetail[];
  imageUrl?: string;
  voiceUrl?: string;
  assignedDepartment?: string;
  assignedTo?: string;
  aiAnalysis?: AIAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  badge: string;
  reportsCount: number;
  verificationsCount: number;
  rank: number;
}

export interface RewardsQuest {
  id: string;
  title: string;
  description: string;
  points: number;
  badgeRequired?: string;
  targetCount: number;
  currentCount: number;
  type: "report" | "verify" | "resolve";
  completed: boolean;
}

export interface CommunityHealthScore {
  ward: string;
  overall: number;
  roads: number;
  lighting: number;
  cleanliness: number;
  water: number;
  safety: number;
  analyzedAt: string;
  aiDiagnostic: string;
}

export interface NotificationDetail {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "status_update" | "points_earned" | "duplicate_merge" | "announcement";
  read: boolean;
  createdAt: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  head: string;
  activeOfficersList: string[];
  resolvedIssuesCount: number;
  avgResolutionDays: number;
}
