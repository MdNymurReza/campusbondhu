// src/components/manual-payment/admin/PaymentQueueTable.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentVerificationService } from '@/services/manual-payment/verification.service';
import { PaymentStatusBadge } from '../shared/PaymentStatusBadge';
import { PaymentMethodBadge } from '../shared/PaymentMethodBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Eye, CheckCircle, XCircle, MessageSquare, User } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentQueueTableProps {
  onRefresh: () => void;
  onBulkVerify: (ids: string[]) => void;
}

export const PaymentQueueTable: React.FC<PaymentQueueTableProps> = ({
  onRefresh,
  onBulkVerify
}) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentVerificationService.getVerificationQueue();
      setPayments(data);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(payments.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(pId => pId !== id));
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return payment.created_at.startsWith(today);
    }
    return payment.payment_method === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedIds.length === payments.length && payments.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm">সিলেক্ট অল</span>
          </div>
          
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-200"
                onClick={() => onBulkVerify(selectedIds)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                ভেরিফাই ({selectedIds.length})
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200"
              >
                <XCircle className="h-4 w-4 mr-2" />
                রিজেক্ট
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <select
            className="border rounded px-3 py-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">সকল</option>
            <option value="today">আজকের</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="bank">ব্যাংক</option>
            <option value="cash">নগদ</option>
          </select>
          <Button size="sm" variant="outline" onClick={loadPayments}>
            <Loader2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-700 w-12">
                #
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">
                তথ্য
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">
                পেমেন্ট
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">
                স্ট্যাটাস
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">
                তারিখ
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">
                একশন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredPayments.map((payment, index) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <Checkbox
                    checked={selectedIds.includes(payment.id)}
                    onCheckedChange={(checked) => 
                      handleSelect(payment.id, checked as boolean)
                    }
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(payment.user_full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{payment.user_full_name || payment.user_email}</div>
                      <div className="text-sm text-gray-500">{payment.course_title}</div>
                      <div className="text-xs text-gray-400">
                        রসিদ: {payment.receipt_number}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    <PaymentMethodBadge method={payment.payment_method} />
                    <div className="text-sm">
                      <div>ID: <code className="bg-gray-100 px-1 rounded">{payment.transaction_id}</code></div>
                      <div>পরিমাণ: <span className="font-semibold">৳{payment.amount}</span></div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <PaymentStatusBadge status={payment.status} />
                  {payment.assigned_to && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      <User className="h-3 w-3 mr-1" />
                      Assigned
                    </Badge>
                  )}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  <div>{format(new Date(payment.created_at), 'dd/MM/yyyy')}</div>
                  <div>{format(new Date(payment.created_at), 'hh:mm a')}</div>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      asChild
                      variant="outline"
                    >
                      <Link to={`/admin/payments/verify/${payment.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            কোন পেমেন্ট পাওয়া যায়নি
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        মোট {filteredPayments.length} টি পেমেন্ট
        {filter !== 'all' && ` (ফিল্টার: ${filter})`}
      </div>
    </div>
  );
};