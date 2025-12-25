// src/components/manual-payment/user/PaymentMethodSelector.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Building2, Radio, Banknote, Wallet, ArrowLeft } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
  onBack: () => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
  onBack
}) => {
  const paymentMethods = [
    {
      id: 'bkash',
      name: 'bKash',
      icon: Smartphone,
      description: 'bKash থেকে পেমেন্ট করুন',
      color: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    {
      id: 'nagad',
      name: 'Nagad',
      icon: Building2,
      description: 'Nagad থেকে পেমেন্ট করুন',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'rocket',
      name: 'Rocket',
      icon: Radio,
      description: 'Rocket (DBBL) থেকে পেমেন্ট করুন',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      id: 'bank',
      name: 'ব্যাংক ট্রান্সফার',
      icon: Banknote,
      description: 'ব্যাংক থেকে ট্রান্সফার করুন',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'cash',
      name: 'নগদ',
      icon: Wallet,
      description: 'অফিসে সরাসরি পেমেন্ট করুন',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        পিছনে
      </Button>

      <h3 className="text-lg font-semibold">পেমেন্ট মাধ্যম নির্বাচন করুন</h3>
      
      <div className="grid gap-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`w-full p-4 border rounded-lg text-left flex items-center gap-4 hover:shadow-md transition-shadow ${
                selectedMethod === method.id ? 'ring-2 ring-primary' : ''
              } ${method.color}`}
            >
              <div className="p-2 rounded-full bg-white">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold">{method.name}</h5>
                <p className="text-sm opacity-80">{method.description}</p>
              </div>
              <div>{selectedMethod === method.id ? '✓' : '→'}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};