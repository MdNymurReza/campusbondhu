// src/components/manual-payment/shared/DateTimeDisplay.tsx
import React from 'react';
import { format } from 'date-fns';

interface DateTimeDisplayProps {
  date: string | Date;
  format?: string;
  showTime?: boolean;
}

export const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({ 
  date, 
  format: formatStr = 'dd/MM/yyyy',
  showTime = false 
}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return (
    <div className="text-sm">
      <div>{format(dateObj, formatStr)}</div>
      {showTime && (
        <div className="text-xs text-gray-500">
          {format(dateObj, 'hh:mm a')}
        </div>
      )}
    </div>
  );
};