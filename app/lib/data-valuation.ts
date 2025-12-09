/**
 * Smart Data Valuation & Sharing System
 * 
 * This system helps determine:
 * 1. What data can be shared (and at what level)
 * 2. How much data is valuable
 * 3. Privacy controls that don't sacrifice UX
 * 4. Optimal data sharing strategies
 */

import { DataValuation, ComplianceCheck } from './permissions';

export interface DataSharingOffer {
  dataSourceId: string;
  recipient: string;
  level: 'view_only' | 'limited_access' | 'full_access';
  duration: 'one_time' | '7_days' | '30_days' | 'unlimited';
  conditions?: string[];
  estimatedValue: number;
  riskLevel: 'low' | 'medium' | 'high';
  complianceRequirements: string[];
}

export interface DataQualityScore {
  completeness: number; // 0-100
  accuracy: number; // 0-100
  consistency: number; // 0-100
  timeliness: number; // 0-100
  overall: number; // 0-100
}

/**
 * Calculate comprehensive data quality score
 */
export function calculateDataQuality(data: DataValuation): DataQualityScore {
  // This would be calculated based on actual data analysis
  // For now, using placeholder logic
  
  const completeness = 85; // Check for missing values
  const accuracy = 90; // Check for anomalies
  const consistency = 88; // Check for duplicates/conflicts
  const timeliness = 92; // Check how recent the data is

  return {
    completeness,
    accuracy,
    consistency,
    timeliness,
    overall: (completeness + accuracy + consistency + timeliness) / 4,
  };
}

/**
 * Determine optimal data sharing strategy
 * 
 * Principle: Don't offer too much (privacy risk) or too little (UX friction)
 */
export function determineOptimalSharing(data: DataValuation): DataSharingOffer[] {
  const offers: DataSharingOffer[] = [];

  // Public data - offer full access
  if (data.sensitivity === 'public') {
    offers.push({
      dataSourceId: data.dataSourceId,
      recipient: 'anyone',
      level: 'full_access',
      duration: 'unlimited',
      estimatedValue: data.estimatedValue,
      riskLevel: 'low',
      complianceRequirements: [],
    });
    return offers;
  }

  // Internal data - offer limited access
  if (data.sensitivity === 'internal_only') {
    offers.push({
      dataSourceId: data.dataSourceId,
      recipient: 'internal_team',
      level: 'limited_access',
      duration: '30_days',
      conditions: ['For internal use only', 'No external sharing'],
      estimatedValue: data.estimatedValue * 0.5,
      riskLevel: 'medium',
      complianceRequirements: ['NDA required'],
    });
    return offers;
  }

  // Confidential data - offer view-only with conditions
  if (data.sensitivity === 'confidential') {
    offers.push({
      dataSourceId: data.dataSourceId,
      recipient: 'authorized_partners',
      level: 'view_only',
      duration: '7_days',
      conditions: [
        'View-only access',
        'No downloading',
        'Audit logging enabled',
        'Automatic expiration',
      ],
      estimatedValue: data.estimatedValue * 0.2,
      riskLevel: 'high',
      complianceRequirements: ['Signed agreement', 'Background check'],
    });
    return offers;
  }

  // Restricted data - no sharing
  if (data.sensitivity === 'restricted') {
    return []; // No sharing offers for restricted data
  }

  return offers;
}

/**
 * Calculate fair market value for data
 */
export function calculateDataMarketValue(data: DataValuation): number {
  const quality = calculateDataQuality(data);
  const baseValue = data.estimatedValue;

  // Quality multiplier (0.5x to 1.5x)
  const qualityMultiplier = 0.5 + (quality.overall / 100) * 1.0;

  // Usage multiplier (0.5x to 2x)
  const usageMultiplier = Math.min(data.usageCount / 100, 2.0);

  // Sensitivity multiplier (0.1x to 1x)
  const sensitivityMultiplier: Record<string, number> = {
    public: 0.1,
    internal_only: 0.3,
    confidential: 0.7,
    restricted: 0.0,
  };

  // Compliance multiplier (1x to 1.5x)
  const compliantChecks = data.complianceChecks.filter(c => c.status === 'compliant').length;
  const complianceMultiplier = 1.0 + (compliantChecks / Math.max(data.complianceChecks.length, 1)) * 0.5;

  const marketValue =
    baseValue *
    qualityMultiplier *
    usageMultiplier *
    sensitivityMultiplier[data.sensitivity] *
    complianceMultiplier;

  return Math.max(0, marketValue);
}

/**
 * Recommend data sharing based on user preferences
 */
export function recommendDataSharing(
  data: DataValuation,
  userPreferences: {
    privacyLevel: 'strict' | 'balanced' | 'permissive';
    monetizationInterest: boolean;
    complianceStrict: boolean;
  }
): DataSharingOffer | null {
  const offers = determineOptimalSharing(data);

  if (offers.length === 0) {
    return null;
  }

  // Filter based on user preferences
  let filtered = offers;

  if (userPreferences.privacyLevel === 'strict') {
    filtered = filtered.filter(o => o.riskLevel === 'low');
  } else if (userPreferences.privacyLevel === 'balanced') {
    filtered = filtered.filter(o => o.riskLevel !== 'high');
  }

  if (userPreferences.complianceStrict) {
    filtered = filtered.filter(o => o.complianceRequirements.length > 0);
  }

  if (!userPreferences.monetizationInterest) {
    filtered = filtered.filter(o => o.estimatedValue === 0);
  }

  // Return the best offer
  return filtered.length > 0 ? filtered[0] : null;
}

/**
 * Check privacy compliance
 */
export async function checkPrivacyCompliance(
  data: DataValuation,
  regulations: string[] // e.g., ['gdpr', 'ccpa']
): Promise<ComplianceCheck[]> {
  const checks: ComplianceCheck[] = [];

  for (const regulation of regulations) {
    const check: ComplianceCheck = {
      type: regulation as any,
      status: 'needs_review',
      lastCheckedAt: new Date(),
    };

    // Simple compliance check logic
    if (regulation === 'gdpr' && data.sensitivity !== 'public') {
      check.status = data.retentionDays <= 365 ? 'compliant' : 'non_compliant';
      check.notes = 'GDPR requires data retention limits';
    }

    if (regulation === 'ccpa' && data.sensitivity !== 'public') {
      check.status = data.shareability === 'restricted' ? 'compliant' : 'needs_review';
      check.notes = 'CCPA requires opt-in for data sharing';
    }

    checks.push(check);
  }

  return checks;
}

/**
 * Generate data sharing recommendations
 */
export function generateSharingRecommendations(data: DataValuation): string[] {
  const recommendations: string[] = [];

  // Quality-based recommendations
  const quality = calculateDataQuality(data);
  if (quality.overall < 70) {
    recommendations.push('Data quality is below 70%. Consider improving data cleaning processes.');
  }

  // Usage-based recommendations
  if (data.usageCount === 0) {
    recommendations.push('This data has never been used. Consider archiving or deleting it.');
  } else if (data.usageCount > 1000) {
    recommendations.push('This data is highly valuable. Consider monetizing it.');
  }

  // Sensitivity-based recommendations
  if (data.sensitivity === 'restricted') {
    recommendations.push('This data is restricted. Ensure proper access controls are in place.');
  }

  // Compliance-based recommendations
  const nonCompliant = data.complianceChecks.filter(c => c.status === 'non_compliant');
  if (nonCompliant.length > 0) {
    recommendations.push(
      `${nonCompliant.length} compliance check(s) failed. Address these before sharing.`
    );
  }

  // Retention-based recommendations
  if (data.retentionDays > 365) {
    recommendations.push('Data retention period is over 1 year. Consider shortening it for privacy.');
  }

  return recommendations;
}

/**
 * Calculate privacy score (0-100)
 */
export function calculatePrivacyScore(data: DataValuation): number {
  let score = 100;

  // Deduct for sensitivity
  const sensitivityDeduction: Record<string, number> = {
    public: 0,
    internal_only: 10,
    confidential: 25,
    restricted: 40,
  };
  score -= sensitivityDeduction[data.sensitivity] || 0;

  // Deduct for long retention
  if (data.retentionDays > 365) {
    score -= 10;
  }

  // Deduct for non-compliance
  const nonCompliant = data.complianceChecks.filter(c => c.status === 'non_compliant').length;
  score -= nonCompliant * 5;

  // Deduct for high usage (more exposure)
  if (data.usageCount > 100) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

