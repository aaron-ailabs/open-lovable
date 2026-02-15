import React from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  intensity = 'medium' 
}) => {
  const intensityClasses = {
    low: 'bg-white/10 backdrop-blur-sm border-white/20',
    medium: 'bg-white/20 backdrop-blur-md border-white/30',
    high: 'bg-white/30 backdrop-blur-lg border-white/40',
  };

  return (
    <div className={cn(
      'rounded-2xl border shadow-xl transition-all duration-300',
      intensityClasses[intensity],
      className
    )}>
      {children}
    </div>
  );
};
