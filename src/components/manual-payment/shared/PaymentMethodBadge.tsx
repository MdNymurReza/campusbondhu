// src/components/manual-payment/shared/PaymentMethodBadge.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Building2, Radio, Banknote, Wallet, CreditCard } from 'lucide-react';

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'bank' | 'cash' | 'others';

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
}

export const PaymentMethodBadge: React.FC<PaymentMethodBadgeProps> = ({ method }) => {
  const getMethodConfig = (method: PaymentMethod) => {
    switch (method) {
      case 'bkash':
        return {
          label: 'bKash',
          icon: <Smartphone className="h-3 w-3 mr-1" />,
          className: 'bg-pink-100 text-pink-800 border-pink-200'
        };
      case 'nagad':
        return {
          label: 'Nagad',
          icon: <Building2 className="h-3 w-3 mr-1" />,
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'rocket':
        return {
          label: 'Rocket',
          icon: <Radio className="h-3 w-3 mr-1" />,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'bank':
        return {
          label: 'ব্যাংক',
          icon: <Banknote className="h-3 w-3 mr-1" />,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'cash':
        return {
          label: 'নগদ',
          icon: <Wallet className="h-3 w-3 mr-1" />,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      default:
        return {
          label: 'অন্যান্য',
          icon: <CreditCard className="h-3 w-3 mr-1" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getMethodConfig(method);

  return (
    <Badge variant="outline" className={config.className}>
      {config.icon}
      {config.label}
    </Badge>
  );
};