// src/components/ui/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({ size = 12, className }: LoadingSpinnerProps) => {
  return (
    <Loader2 
      className={cn(`w-${size} h-${size} animate-spin text-primary`, className)}
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;