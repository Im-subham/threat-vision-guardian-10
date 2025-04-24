
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ThreatLevelBadgeProps {
  level?: string;
}

const ThreatLevelBadge = ({ level }: ThreatLevelBadgeProps) => {
  switch (level) {
    case 'low':
      return (
        <Badge variant="outline" className="bg-threat-low/20 text-threat-low border-threat-low">
          Low Risk
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="outline" className="bg-threat-medium/20 text-threat-medium border-threat-medium">
          Medium Risk
        </Badge>
      );
    case 'high':
      return (
        <Badge variant="outline" className="bg-threat-high/20 text-threat-high border-threat-high">
          High Risk
        </Badge>
      );
    case 'safe':
    default:
      return (
        <Badge variant="outline" className="bg-threat-safe/20 text-threat-safe border-threat-safe">
          Safe
        </Badge>
      );
  }
};

export default ThreatLevelBadge;
