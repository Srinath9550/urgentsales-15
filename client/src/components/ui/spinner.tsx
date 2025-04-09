import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  className 
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };
  
  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary', 
        sizeMap[size],
        className
      )} 
    />
  );
}