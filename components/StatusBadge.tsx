
import React from 'react';
import { Decision, RiskLevel } from '../types';

interface StatusBadgeProps {
  type: 'decision' | 'risk';
  value: Decision | RiskLevel;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  const getColors = () => {
    const v = value.toUpperCase();
    // Semantic color mapping based on risk/decision
    if (v === 'ACCEPT' || v === 'LOW') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (v === 'REVIEW' || v === 'MEDIUM') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    if (v === 'REJECT' || v === 'HIGH') {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getLabel = () => {
    if (type === 'decision') {
      if (value === 'ACCEPT') return 'Accepted';
      if (value === 'REVIEW') return 'Sent for Human Review';
      if (value === 'REJECT') return 'Rejected';
    }
    return value;
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getColors()}`}>
      {getLabel()}
    </span>
  );
};
