import React from 'react';
import { cn } from '@/utils/cn';

interface BrutalistCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({ 
  title, 
  description, 
  icon, 
  className,
  onClick 
}) => {
  return (
    <div 
      className={cn(
        "p-6 bg-white dark:bg-black border-4 border-black dark:border-white brutalist-shadow transition-all hover:-translate-x-1 hover:-translate-y-1 cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        {icon && <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>}
        <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>
      </div>
      <p className="text-sm font-mono leading-relaxed opacity-80">{description}</p>
    </div>
  );
};
