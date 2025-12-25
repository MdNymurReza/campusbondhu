// src/components/manual-payment/shared/PaymentStatusBadge.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

type PaymentStatus = 'submitted' | 'under_review' | 'verified' | 'rejected' | 'cancelled';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'verified':
        return {
          label: 'ভেরিফাইড',
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'rejected':
        return {
          label: 'রিজেক্টেড',
          icon: <XCircle className="h-3 w-3 mr-1" />,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'submitted':
        return {
          label: 'জমা হয়েছে',
          icon: <Clock className="h-3 w-3 mr-1" />,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'under_review':
        return {
          label: 'রিভিউ চলছে',
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        return {
          label: 'বাতিল',
          icon: <XCircle className="h-3 w-3 mr-1" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={config.className}>
      {config.icon}
      {config.label}
    </Badge>
  );
};