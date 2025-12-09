/**
 * Granular Permission System
 * 
 * Permission Levels:
 * 0: None - No access
 * 1: View - Can only view, no action
 * 2: Suggest - Can suggest actions, needs approval
 * 3: Execute - Can execute, but logs all actions
 * 4: Auto-Execute - Can auto-execute low-risk actions
 */

export enum PermissionLevel {
  NONE = 0,
  VIEW = 1,
  SUGGEST = 2,
  EXECUTE = 3,
  AUTO_EXECUTE = 4,
}

export interface Permission {
  id: string;
  agentId: string;
  actionType: string; // e.g., "code_generation", "deployment", "data_access"
  level: PermissionLevel;
  conditions?: PermissionCondition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionCondition {
  type: 'confidence_threshold' | 'risk_level' | 'data_sensitivity' | 'cost_limit';
  value: number | string;
  operator: '>' | '<' | '=' | '>=' | '<=' | 'in' | 'not_in';
}

export interface AgentAction {
  id: string;
  agentId: string;
  actionType: string;
  description: string;
  suggestedBy: string; // Agent name
  confidence: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost?: number;
  dataSensitivity?: 'public' | 'internal' | 'confidential' | 'restricted';
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
  humanApprovalRequired: boolean;
  autoExecuteEligible: boolean;
  createdAt: Date;
  executedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  feedback?: ActionFeedback;
}

export interface ActionFeedback {
  approved: boolean;
  reason?: string;
  confidence?: number; // How confident the human was in their decision
  suggestedImprovement?: string;
  timestamp: Date;
}

export interface LearningMetrics {
  agentId: string;
  actionType: string;
  totalActions: number;
  approvedActions: number;
  rejectedActions: number;
  autoExecutedActions: number;
  failedActions: number;
  avgConfidence: number;
  avgApprovalTime: number; // in ms
  accuracyScore: number; // 0-1
  lastUpdated: Date;
}

export interface DataValuation {
  dataSourceId: string;
  name: string;
  quality: number; // 0-100
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  usageCount: number;
  lastUsedAt: Date;
  estimatedValue: number; // in currency units
  shareability: 'public' | 'internal_only' | 'restricted' | 'not_shareable';
  retentionDays: number;
  complianceChecks: ComplianceCheck[];
}

export interface ComplianceCheck {
  type: 'gdpr' | 'ccpa' | 'hipaa' | 'pci_dss' | 'sox';
  status: 'compliant' | 'non_compliant' | 'needs_review';
  lastCheckedAt: Date;
  notes?: string;
}

/**
 * Determine if an action should require human approval
 */
export function shouldRequireApproval(
  action: AgentAction,
  permission: Permission,
  metrics?: LearningMetrics
): boolean {
  // Always require approval for critical risk actions
  if (action.riskLevel === 'critical') {
    return true;
  }

  // Check permission level
  if (permission.level < PermissionLevel.EXECUTE) {
    return true;
  }

  // Check confidence threshold
  if (action.confidence < 0.7) {
    return true;
  }

  // Check if action is in high-sensitivity data
  if (action.dataSensitivity === 'restricted') {
    return true;
  }

  // Check learning metrics - if agent has poor accuracy, require approval
  if (metrics && metrics.accuracyScore < 0.8) {
    return true;
  }

  return false;
}

/**
 * Determine if an action can auto-execute
 */
export function canAutoExecute(
  action: AgentAction,
  permission: Permission,
  metrics?: LearningMetrics
): boolean {
  // Must have AUTO_EXECUTE permission
  if (permission.level < PermissionLevel.AUTO_EXECUTE) {
    return false;
  }

  // Must be low risk
  if (action.riskLevel !== 'low') {
    return false;
  }

  // Must have high confidence
  if (action.confidence < 0.9) {
    return false;
  }

  // Must not involve sensitive data
  if (action.dataSensitivity && action.dataSensitivity !== 'public') {
    return false;
  }

  // Check agent accuracy
  if (metrics && metrics.accuracyScore < 0.95) {
    return false;
  }

  return true;
}

/**
 * Calculate data value score
 */
export function calculateDataValue(data: DataValuation): number {
  let score = 0;

  // Quality factor (0-30)
  score += (data.quality / 100) * 30;

  // Usage factor (0-30)
  const usageScore = Math.min(data.usageCount / 100, 1) * 30;
  score += usageScore;

  // Sensitivity factor (0-20)
  const sensitivityMultiplier: Record<string, number> = {
    public: 0.5,
    internal_only: 1.0,
    restricted: 1.5,
    not_shareable: 0,
  };
  score += (sensitivityMultiplier[data.sensitivity] || 0.5) * 20;

  // Compliance factor (0-20)
  const compliantChecks = data.complianceChecks.filter(c => c.status === 'compliant').length;
  score += (compliantChecks / Math.max(data.complianceChecks.length, 1)) * 20;

  return Math.min(score, 100);
}

/**
 * Suggest permission level based on learning metrics
 */
export function suggestPermissionLevel(
  metrics: LearningMetrics,
  currentLevel: PermissionLevel
): PermissionLevel {
  // If accuracy is very high, suggest higher permission
  if (metrics.accuracyScore > 0.95 && currentLevel < PermissionLevel.AUTO_EXECUTE) {
    return Math.min(currentLevel + 1, PermissionLevel.AUTO_EXECUTE);
  }

  // If accuracy is very low, suggest lower permission
  if (metrics.accuracyScore < 0.7 && currentLevel > PermissionLevel.SUGGEST) {
    return Math.max(currentLevel - 1, PermissionLevel.SUGGEST);
  }

  return currentLevel;
}

