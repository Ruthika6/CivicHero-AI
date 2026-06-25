import { CommunityIssue, LeaderboardEntry, RewardsQuest, CommunityHealthScore, UserProfile } from "../types";

export const MOCK_USERS: Record<string, UserProfile> = {
  citizen1: {
    id: "citizen1",
    name: "Alex Rivera",
    email: "alex.rivera@civichero.org",
    role: "citizen",
    points: 175,
    reportsCount: 4,
    verificationsCount: 5,
    badges: ["Local Reporter", "Road Ranger"],
    currentBadge: "🥉 Local Reporter",
    joinedAt: "2026-01-15T10:00:00Z"
  },
  verifier1: {
    id: "verifier1",
    name: "Elena Rostova",
    email: "elena.rust@civichero.org",
    role: "verifier",
    points: 850,
    reportsCount: 12,
    verificationsCount: 42,
    badges: ["Local Reporter", "Community Guardian", "Trash Tracker", "Eagle Eye"],
    currentBadge: "🥈 Community Guardian",
    joinedAt: "2025-11-01T08:30:00Z"
  },
  officer1: {
    id: "officer1",
    name: "Chief Officer Marcus Thorne",
    email: "m.thorne@citydep.gov",
    role: "officer",
    points: 120,
    reportsCount: 1,
    verificationsCount: 0,
    badges: ["Civic Hero"],
    currentBadge: "🥇 Civic Hero",
    joinedAt: "2025-08-20T09:00:00Z"
  },
  admin1: {
    id: "admin1",
    name: "ruthikareddy09",
    email: "ruthikareddy09@gmail.com",
    role: "admin",
    points: 2500,
    reportsCount: 35,
    verificationsCount: 120,
    badges: ["Local Reporter", "Community Guardian", "Civic Hero", "Community Champion"],
    currentBadge: "🏆 Community Champion",
    joinedAt: "2025-05-10T12:00:00Z"
  }
};

export const MOCK_ISSUES: CommunityIssue[] = [
  {
    id: "issue1",
    title: "Major Pothole on Oak Street",
    category: "Road Damage",
    description: "Deep, axle-shattering pothole in the middle of the active lane right outside 1400 Oak Street. Cars are swerving dangerously into oncoming traffic to avoid it. Getting larger after the heavy rain yesterday.",
    location: {
      lat: 37.7712,
      lng: -122.4285,
      address: "1400 Oak St, San Francisco, CA 94117",
      ward: "Ward 5 (Haight-Ashbury)"
    },
    severity: "High",
    status: "in_progress",
    reporter: {
      id: "citizen1",
      name: "Alex Rivera",
      email: "alex.rivera@civichero.org"
    },
    votes: ["citizen1", "user2", "user3", "user4"],
    verifications: [
      {
        id: "v1",
        userId: "verifier1",
        userName: "Elena Rostova",
        comment: "I live near Oak street. Visited the site and verified this pothole is indeed extremely dangerous, about 8 inches deep and full of water. Definitely high priority.",
        status: "verified",
        createdAt: "2026-06-21T14:30:00Z"
      }
    ],
    comments: [
      {
        id: "c1",
        userId: "officer1",
        userName: "Chief Marcus Thorne",
        userRole: "officer",
        text: "Public Works team has been assigned for cold-patch repair. Work order #PW-99214 created.",
        createdAt: "2026-06-22T08:15:00Z"
      }
    ],
    assignedDepartment: "Department of Public Works",
    assignedTo: "Chief Marcus Thorne",
    aiAnalysis: {
      detectedIssues: ["Pothole", "Asphalt fracture", "Road water logging"],
      visionSeverity: "High",
      visionConfidence: 0.94,
      visibleDamage: "Concrete failure in high-traffic commercial zone, depth exceeding 8 inches, structure deterioration in adjacent lane.",
      recommendedDepartment: "Public Works - Roads Maintenance Division",
      classifiedTitle: "Hazardous Deep Pothole on Oak Street",
      classifiedCategory: "Roads & Transit",
      classifiedDescription: "Significant circular crater in road structure at 1400 Oak St, posing direct collision risks.",
      classifiedPriority: "High",
      isDuplicate: false,
      riskLevel: "High",
      affectedCitizensEstimate: 850,
      escalationProbability: 75,
      longTermRiskSummary: "Swerving vehicles could cause high-velocity front-end collisions. Sub-base erosion may expand the defect, potentially undermining the sewer main located directly underneath.",
      priorityScore: 89,
      formulaBreakdown: {
        severityPoints: 24,
        votingPoints: 15,
        impactPoints: 28,
        agePoints: 22
      },
      repairApproach: "Excavate surrounding cracked sub-base, compact sub-grade, fill with warm-mix dense aggregate asphalt, and seal-coat joints.",
      temporaryMitigation: "Erect immediate high-reflectivity safety cones and flashing high-hazard warning barrier.",
      estimatedCost: "$350 - $550",
      estimatedResolutionDays: 3
    },
    createdAt: "2026-06-20T11:22:00Z",
    updatedAt: "2026-06-22T08:15:00Z"
  },
  {
    id: "issue2",
    title: "Burst Water Main causing Flooding",
    category: "Water Leakage",
    description: "Water is shooting up from the sidewalk joint next to the stormwater drain on 24th Street. It has completely flooded the pedestrian crosswalk and is starting to wash away garden bed soil.",
    location: {
      lat: 37.7523,
      lng: -122.4138,
      address: "3200 24th St, San Francisco, CA 94110",
      ward: "Ward 9 (Mission District)"
    },
    severity: "Critical",
    status: "verified",
    reporter: {
      id: "verifier1",
      name: "Elena Rostova",
      email: "elena.rust@civichero.org"
    },
    votes: ["verifier1", "citizen1", "user5", "user6", "user7", "user8", "user9"],
    verifications: [
      {
        id: "v2",
        userId: "user5",
        userName: "Damon Cole",
        comment: "Can confirm. Water pressure is high, street is turning into a creek. Walkways blocked.",
        status: "verified",
        createdAt: "2026-06-22T19:45:00Z"
      }
    ],
    comments: [],
    assignedDepartment: "Water & Sewerage Authority",
    aiAnalysis: {
      detectedIssues: ["Water pipe leakage", "Sidewalk erosion", "Crosswalk flooding"],
      visionSeverity: "Critical",
      visionConfidence: 0.98,
      visibleDamage: "Major potable water main breach, substantial structural water pooling, rapid soil sub-grade washaway.",
      recommendedDepartment: "Water Operations - Emergency Services",
      classifiedTitle: "Sewer/Water Main Burst Flooding",
      classifiedCategory: "Water & Sanitation",
      classifiedDescription: "High-pressure utility eruption on pedestrian walkway, actively submerging neighborhood sidewalks.",
      classifiedPriority: "Critical",
      isDuplicate: false,
      riskLevel: "Critical",
      affectedCitizensEstimate: 2400,
      escalationProbability: 95,
      longTermRiskSummary: "Water logging will induce sinkholes on the pavement within 7 days. Low municipal water pressure in Ward 9 high-rises and severe soil subsidence around utility poles are imminent.",
      priorityScore: 97,
      formulaBreakdown: {
        severityPoints: 30,
        votingPoints: 20,
        impactPoints: 30,
        agePoints: 17
      },
      repairApproach: "Shut main valve, isolate the affected section, core-drill the sidewalk concrete, repair the 4-inch ductile iron pipe sleeve, backfill with gravel, repave sidewalk.",
      temporaryMitigation: "Urgent primary shutoff of regional valve, barricade flooded sidewalks, and steer runoff into high-capacity sewer inlets.",
      estimatedCost: "$1,800 - $3,200",
      estimatedResolutionDays: 1
    },
    createdAt: "2026-06-22T18:30:00Z",
    updatedAt: "2026-06-23T00:10:00Z"
  },
  {
    id: "issue3",
    title: "Broken Streetlight on 18th Ave",
    category: "Broken Streetlight",
    description: "The street panel lamp has been completely dead for 4 days. The entire intersection at 18th Avenue and Geary Boulevard is pitch black at night, causing pedestrian safety issues near the bus stop.",
    location: {
      lat: 37.7801,
      lng: -122.4764,
      address: "Intersection of 18th Ave & Geary Blvd, San Francisco, CA 94121",
      ward: "Ward 1 (Richmond District)"
    },
    severity: "Medium",
    status: "reported",
    reporter: {
      id: "user10",
      name: "Toby Vance",
      email: "toby.v@civichero.org"
    },
    votes: ["user10"],
    verifications: [],
    comments: [],
    assignedDepartment: "Bureau of Street Lighting",
    aiAnalysis: {
      detectedIssues: ["Burnt out sodium bulb", "Streetlight electrical fault"],
      visionSeverity: "Medium",
      visionConfidence: 0.89,
      visibleDamage: "Single fixture unlit. Bracket and pole seem physically intact. No external impact markings.",
      recommendedDepartment: "Public Utilities - Lighting Divison",
      classifiedTitle: "Inoperative Intersection Streetlight",
      classifiedCategory: "Grid & Lighting",
      classifiedDescription: "Single dead streetlight at busy bus station, inducing dark zones.",
      classifiedPriority: "Medium",
      isDuplicate: false,
      riskLevel: "Medium",
      affectedCitizensEstimate: 300,
      escalationProbability: 40,
      longTermRiskSummary: "Aesthetic darkness heightens regional dark-zone crime statistics and drops nocturnal visibility statistics for crossing pedestrians near high-frequency bus lines.",
      priorityScore: 54,
      formulaBreakdown: {
        severityPoints: 15,
        votingPoints: 5,
        impactPoints: 14,
        agePoints: 20
      },
      repairApproach: "Bulb socket checkout, replacement of obsolete high-pressure sodium (HPS) with energy-efficient 45W solid-state LED.",
      temporaryMitigation: "N/A - Direct replacement with utility truck.",
      estimatedCost: "$150 - $220",
      estimatedResolutionDays: 5
    },
    createdAt: "2026-06-19T21:00:00Z",
    updatedAt: "2026-06-19T21:00:00Z"
  },
  {
    id: "issue4",
    title: "Illegal Trash Dumping in Park Alley",
    category: "Garbage Dump",
    description: "Huge piles of old mattresses, construction wooden scraps, plastic bins, and household food trash dumped illegally inside the public alleyway flanking Golden Gate Park.",
    location: {
      lat: 37.7688,
      lng: -122.4562,
      address: "Cole Street Alley, San Francisco, CA 94117",
      ward: "Ward 5 (Haight-Ashbury)"
    },
    severity: "High",
    status: "verified",
    reporter: {
      id: "citizen1",
      name: "Alex Rivera",
      email: "alex.rivera@civichero.org"
    },
    votes: ["citizen1", "verifier1", "user2"],
    verifications: [
      {
        id: "v3",
        userId: "verifier1",
        userName: "Elena Rostova",
        comment: "Inspected Cole St. Dump site. It has begun to attract birds and raccoons. Strongly toxic decomposition odors starting. This must be cleared asap.",
        status: "verified",
        createdAt: "2026-06-22T09:12:00Z"
      }
    ],
    comments: [],
    assignedDepartment: "Sanitation & Waste Services Bureau",
    aiAnalysis: {
      detectedIssues: ["Illegal waste stack", "Hazardous bio-waste", "Pest breeding ground"],
      visionSeverity: "High",
      visionConfidence: 0.96,
      visibleDamage: "Large accumulation of bulk debris, biological organic waste, and synthetic polymer blocks.",
      recommendedDepartment: "Environmental Sanitation - Rapid Response Squad",
      classifiedTitle: "Unsanctioned Bio-Hazardous Trash Dump",
      classifiedCategory: "Environmental & Sanitation",
      classifiedDescription: "Unlawful bulk waste deposit obstructing storm buffers and pedestrian alleys.",
      classifiedPriority: "High",
      isDuplicate: false,
      riskLevel: "High",
      affectedCitizensEstimate: 600,
      escalationProbability: 80,
      longTermRiskSummary: "Attracts vectors of disease (rats, pests) within 48 hours. Rainfall will wash synthetic compounds, varnish, and toxins directly into Golden Gate Park sub-aquifers.",
      priorityScore: 78,
      formulaBreakdown: {
        severityPoints: 20,
        votingPoints: 12,
        impactPoints: 26,
        agePoints: 20
      },
      repairApproach: "Mobilize front-loader garbage transport, dispatch a 4-man sanitation haul crew, spray chemical neutralizers/disinfectants upon clearing.",
      temporaryMitigation: "Envelop dumping site in plastic weather-shrouding, erect physical hazard tape, post explicit anti-dumping regulation placards.",
      estimatedCost: "$450 - $700",
      estimatedResolutionDays: 2
    },
    createdAt: "2026-06-21T06:40:00Z",
    updatedAt: "2026-06-22T09:12:00Z"
  },
  {
    id: "issue5",
    title: "Cracked Sidewalk causing Trip Hazard",
    category: "Road Damage",
    description: "Tree roots have pushed up the concrete pavement slabs, raising them by nearly 5 inches. This creates a terrible trip hazard directly in front of the kids community care playground.",
    location: {
      lat: 37.7595,
      lng: -122.4350,
      address: "Castro Street Civic Center, San Francisco, CA 94114",
      ward: "Ward 8 (Castro/Noe Valley)"
    },
    severity: "Medium",
    status: "resolved",
    reporter: {
      id: "verifier1",
      name: "Elena Rostova",
      email: "elena.rust@civichero.org"
    },
    votes: ["verifier1", "user1", "user5"],
    verifications: [],
    comments: [
      {
        id: "c2",
        userId: "officer1",
        userName: "Chief Marcus Thorne",
        userRole: "officer",
        text: "Urban Parks Division shaved the root section and repoured standard micro-reinforced flat concrete panels. Safety restored.",
        createdAt: "2026-06-22T17:00:00Z"
      }
    ],
    assignedDepartment: "Department of Urban Parks & Forestry",
    aiAnalysis: {
      detectedIssues: ["Pavement upheaval", "Tree root concrete fracture", "Pedestrian barrier"],
      visionSeverity: "Medium",
      visionConfidence: 0.91,
      visibleDamage: "Slab displacement up to 5 inches. Root growth encroachment directly below transit-way surface.",
      recommendedDepartment: "Forestry & Urban Infrastructure",
      classifiedTitle: "Safety Uplifted Sidewalk Concrete Paving",
      classifiedCategory: "Structure & Parks",
      classifiedDescription: "Vertical paving offset adjacent to primary childcare perimeter, forming severe physical obstruction.",
      classifiedPriority: "Medium",
      isDuplicate: false,
      riskLevel: "Medium",
      affectedCitizensEstimate: 450,
      escalationProbability: 35,
      longTermRiskSummary: "Multiple falls resulting in liability claims for local municipal district. Direct impact to elderly and mobility-challenged residents entering children care facilities.",
      priorityScore: 61,
      formulaBreakdown: {
        severityPoints: 16,
        votingPoints: 10,
        impactPoints: 15,
        agePoints: 20
      },
      repairApproach: "Trim the superficial tree adventitious root systems without compromising trunk health, pour flexible expanding foam block, finish with non-slip silica-coated cement overlay.",
      temporaryMitigation: "Enamel the offset edge in warning safety safety-yellow pigment.",
      estimatedCost: "$300 - $450",
      estimatedResolutionDays: 4
    },
    createdAt: "2026-06-18T09:15:00Z",
    updatedAt: "2026-06-22T17:00:00Z"
  }
];

export const MOCK_LEADERboard: LeaderboardEntry[] = [
  {
    id: "user_l1",
    name: "Marcus Vance",
    points: 1240,
    badge: "🏆 Community Champion",
    reportsCount: 18,
    verificationsCount: 65,
    rank: 1
  },
  {
    id: "verifier1",
    name: "Elena Rostova",
    points: 850,
    badge: "🥈 Community Guardian",
    reportsCount: 12,
    verificationsCount: 42,
    rank: 2
  },
  {
    id: "user_l3",
    name: "Dr. Kenji Sato",
    points: 620,
    badge: "🥈 Community Guardian",
    reportsCount: 9,
    verificationsCount: 28,
    rank: 3
  },
  {
    id: "user_l4",
    name: "Sarah Jenkins",
    points: 390,
    badge: "🥉 Local Reporter",
    reportsCount: 6,
    verificationsCount: 15,
    rank: 4
  },
  {
    id: "citizen1",
    name: "Alex Rivera",
    points: 175,
    badge: "🥉 Local Reporter",
    reportsCount: 4,
    verificationsCount: 5,
    rank: 5
  },
  {
    id: "user_l6",
    name: "Deepak Sharma",
    points: 140,
    badge: "🥉 Local Reporter",
    reportsCount: 3,
    verificationsCount: 4,
    rank: 6
  }
];

export const MOCK_QUESTS: RewardsQuest[] = [
  {
    id: "q1",
    title: "Pothole Patrol",
    description: "Report 2 pothole issues in any ward to help public works teams deploy faster patching crews.",
    points: 150,
    targetCount: 2,
    currentCount: 1,
    type: "report",
    completed: false
  },
  {
    id: "q2",
    title: "Eco Guardian",
    description: "Verify 3 illegal garbage dump sights anywhere in the district to accelerate clear-out sweeps.",
    points: 200,
    targetCount: 3,
    currentCount: 2,
    type: "verify",
    completed: false
  },
  {
    id: "q3",
    title: "Safety Sentinel",
    description: "Report or verify 4 street lighting problems to make intersections much safer for late night commuters.",
    points: 250,
    targetCount: 4,
    currentCount: 4,
    type: "verify",
    completed: true
  },
  {
    id: "q4",
    title: "Heroic Solver",
    description: "Help resolve an issue by providing supportive on-ground photos showing after-repair status.",
    points: 350,
    targetCount: 1,
    currentCount: 0,
    type: "resolve",
    completed: false
  }
];

export const MOCK_HEALTH_SCORES: CommunityHealthScore[] = [
  {
    ward: "Ward 5 (Haight-Ashbury)",
    overall: 73,
    roads: 65,
    lighting: 82,
    cleanliness: 55,
    water: 78,
    safety: 85,
    analyzedAt: "2026-06-22T00:00:00Z",
    aiDiagnostic: "Cleanliness issues (illegal dump heaps) in Golden Gate buffers represent the chief vulnerability here. Power grids and lighting are top tier, maintaining crime statistics in safe brackets."
  },
  {
    ward: "Ward 9 (Mission District)",
    overall: 59,
    roads: 58,
    lighting: 64,
    cleanliness: 49,
    water: 45,
    safety: 79,
    analyzedAt: "2026-06-22T00:00:00Z",
    aiDiagnostic: "A critical drinking main burst has significantly eroded nearby sidewalk segments. Prompt replacement of aged cast-iron piping valves is highly recommended to protect other infrastructure."
  },
  {
    ward: "Ward 1 (Richmond District)",
    overall: 81,
    roads: 79,
    lighting: 62,
    cleanliness: 88,
    water: 92,
    safety: 84,
    analyzedAt: "2026-06-22T00:00:00Z",
    aiDiagnostic: "Excellent sanitation metrics, but light outages near Geary transit loops require prompt bulb replacement projects. Pedestrian security requires LED upgrades around dark lanes."
  },
  {
    ward: "Ward 8 (Castro/Noe Valley)",
    overall: 89,
    roads: 85,
    lighting: 91,
    cleanliness: 84,
    water: 93,
    safety: 92,
    analyzedAt: "2026-06-22T00:00:00Z",
    aiDiagnostic: "Highly active community feedback loop. Most sidewalks and roads have been repoured recently. Continued safety scores require proactive foliage root systems trimming along commercial districts."
  }
];
