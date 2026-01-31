
export type Decision = 'ACCEPT' | 'REJECT' | 'REVIEW';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum VerificationStep {
  START = 'START',
  DOCUMENT = 'DOCUMENT',
  BIOMETRICS = 'BIOMETRICS',
  BEHAVIOR = 'BEHAVIOR',
  SCORING = 'SCORING',
  RESULT = 'RESULT'
}

export interface VerificationOutcome {
  id: string;
  timestamp: string;
  documentScore: number;
  biometricScore: number;
  behaviorScore: number;
  overallScore: number;
  isAiGenerated: boolean;
  decision: Decision;
  riskLevel: RiskLevel;
  details: string;
  officerComments?: string;
  reviewedBy?: string;
  reviewTimestamp?: string;
}

export interface KYCState {
  currentStep: VerificationStep;
  loading: boolean;
  error: string | null;
  outcome: VerificationOutcome | null;
}
