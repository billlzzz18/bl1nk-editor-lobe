/**
 * Learning Loop & Feedback System
 * 
 * This system captures human decisions and uses them to improve AI agent performance
 * while maintaining UX efficiency by learning which actions need approval.
 */

import { AgentAction, ActionFeedback, LearningMetrics, PermissionLevel } from './permissions';

export interface FeedbackEntry {
  actionId: string;
  agentId: string;
  actionType: string;
  humanDecision: 'approved' | 'rejected';
  confidence: number; // How confident the human was (0-1)
  reason?: string;
  improvement?: string;
  timeToDecide: number; // in milliseconds
  timestamp: Date;
}

export interface LearningPattern {
  actionType: string;
  approvalRate: number; // 0-1
  avgConfidence: number;
  avgTimeToDecide: number;
  commonRejectReasons: Map<string, number>;
  suggestedPermissionLevel: PermissionLevel;
}

/**
 * Record human feedback on an AI action
 */
export async function recordFeedback(
  action: AgentAction,
  feedback: ActionFeedback,
  db: any // Database connection
): Promise<FeedbackEntry> {
  const entry: FeedbackEntry = {
    actionId: action.id,
    agentId: action.agentId,
    actionType: action.actionType,
    humanDecision: feedback.approved ? 'approved' : 'rejected',
    confidence: feedback.confidence || 0.5,
    reason: feedback.reason,
    improvement: feedback.suggestedImprovement,
    timeToDecide: Date.now() - action.createdAt.getTime(),
    timestamp: new Date(),
  };

  // Save to database
  await db.feedbackHistory.create(entry);

  // Update learning metrics
  await updateLearningMetrics(action.agentId, action.actionType, db);

  return entry;
}

/**
 * Update learning metrics based on feedback
 */
export async function updateLearningMetrics(
  agentId: string,
  actionType: string,
  db: any
): Promise<LearningMetrics> {
  const feedback = await db.feedbackHistory.findMany({
    where: { agentId, actionType },
  });

  const totalActions = feedback.length;
  const approvedActions = feedback.filter((f: FeedbackEntry) => f.humanDecision === 'approved').length;
  const rejectedActions = feedback.filter((f: FeedbackEntry) => f.humanDecision === 'rejected').length;

  // Calculate accuracy score (approved / total)
  const accuracyScore = totalActions > 0 ? approvedActions / totalActions : 0;

  // Calculate average confidence
  const avgConfidence = totalActions > 0
    ? feedback.reduce((sum: number, f: FeedbackEntry) => sum + f.confidence, 0) / totalActions
    : 0;

  // Calculate average decision time
  const avgTimeToDecide = totalActions > 0
    ? feedback.reduce((sum: number, f: FeedbackEntry) => sum + f.timeToDecide, 0) / totalActions
    : 0;

  const metrics: LearningMetrics = {
    agentId,
    actionType,
    totalActions,
    approvedActions,
    rejectedActions,
    autoExecutedActions: 0, // Will be calculated separately
    failedActions: 0, // Will be calculated separately
    avgConfidence,
    avgApprovalTime: avgTimeToDecide,
    accuracyScore,
    lastUpdated: new Date(),
  };

  // Save metrics
  await db.learningMetrics.upsert(
    { agentId, actionType },
    { data: metrics }
  );

  return metrics;
}

/**
 * Analyze patterns in human decisions
 */
export async function analyzeLearningPatterns(
  agentId: string,
  db: any
): Promise<Map<string, LearningPattern>> {
  const metrics = await db.learningMetrics.findMany({
    where: { agentId },
  });

  const patterns = new Map<string, LearningPattern>();

  for (const metric of metrics) {
    const feedback = await db.feedbackHistory.findMany({
      where: { agentId, actionType: metric.actionType },
    });

    // Collect rejection reasons
    const rejectReasons = new Map<string, number>();
    for (const f of feedback) {
      if (f.humanDecision === 'rejected' && f.reason) {
        rejectReasons.set(f.reason, (rejectReasons.get(f.reason) || 0) + 1);
      }
    }

    // Suggest permission level based on accuracy
    let suggestedLevel = PermissionLevel.SUGGEST;
    if (metric.accuracyScore > 0.95) {
      suggestedLevel = PermissionLevel.AUTO_EXECUTE;
    } else if (metric.accuracyScore > 0.85) {
      suggestedLevel = PermissionLevel.EXECUTE;
    }

    patterns.set(metric.actionType, {
      actionType: metric.actionType,
      approvalRate: metric.approvedActions / Math.max(metric.totalActions, 1),
      avgConfidence: metric.avgConfidence,
      avgTimeToDecide: metric.avgApprovalTime,
      commonRejectReasons: rejectReasons,
      suggestedPermissionLevel: suggestedLevel,
    });
  }

  return patterns;
}

/**
 * Predict if human will approve an action
 */
export async function predictApprovalProbability(
  action: AgentAction,
  db: any
): Promise<number> {
  // Get historical data for similar actions
  const similarActions = await db.feedbackHistory.findMany({
    where: {
      agentId: action.agentId,
      actionType: action.actionType,
    },
  });

  if (similarActions.length === 0) {
    // Default to 50% if no history
    return 0.5;
  }

  // Calculate approval probability based on confidence
  const approvalRate = similarActions.filter((a: FeedbackEntry) => a.humanDecision === 'approved').length
    / similarActions.length;

  // Adjust based on current action confidence
  const confidenceAdjustment = (action.confidence - 0.5) * 0.2; // -0.1 to +0.1 adjustment
  const prediction = Math.max(0, Math.min(1, approvalRate + confidenceAdjustment));

  return prediction;
}

/**
 * Generate recommendations for improving agent performance
 */
export async function generateRecommendations(
  agentId: string,
  db: any
): Promise<string[]> {
  const patterns = await analyzeLearningPatterns(agentId, db);
  const recommendations: string[] = [];

  for (const [actionType, pattern] of patterns) {
    // Low approval rate
    if (pattern.approvalRate < 0.7) {
      recommendations.push(
        `Agent ${agentId} has low approval rate (${(pattern.approvalRate * 100).toFixed(1)}%) for ${actionType}. ` +
        `Consider reviewing the agent's logic or increasing human oversight.`
      );
    }

    // High decision time
    if (pattern.avgTimeToDecide > 60000) { // > 1 minute
      recommendations.push(
        `Humans take long time (${(pattern.avgTimeToDecide / 1000).toFixed(1)}s) to approve ${actionType}. ` +
        `Consider simplifying the approval interface or providing more context.`
      );
    }

    // Common rejection reasons
    if (pattern.commonRejectReasons.size > 0) {
      const topReason = Array.from(pattern.commonRejectReasons.entries())
        .sort((a, b) => b[1] - a[1])[0];
      recommendations.push(
        `Most common rejection reason for ${actionType}: "${topReason[0]}". ` +
        `Consider addressing this in the agent's decision logic.`
      );
    }

    // Permission level suggestion
    if (pattern.suggestedPermissionLevel > PermissionLevel.SUGGEST) {
      recommendations.push(
        `Agent ${agentId} has high accuracy (${(pattern.avgConfidence * 100).toFixed(1)}%) for ${actionType}. ` +
        `Consider increasing permission level to reduce approval overhead.`
      );
    }
  }

  return recommendations;
}

/**
 * Calculate learning efficiency score
 */
export function calculateLearningEfficiency(metrics: LearningMetrics): number {
  let score = 0;

  // Accuracy (0-40)
  score += metrics.accuracyScore * 40;

  // Decision speed (0-30) - faster is better
  const speedScore = Math.max(0, 1 - (metrics.avgApprovalTime / 60000)); // Normalize to 1 min
  score += speedScore * 30;

  // Action volume (0-30) - more actions is better
  const volumeScore = Math.min(metrics.totalActions / 100, 1);
  score += volumeScore * 30;

  return Math.min(score, 100);
}

