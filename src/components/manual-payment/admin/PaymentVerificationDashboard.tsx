// src/components/manual-payment/admin/PaymentVerificationDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { paymentVerificationService } from '../../../services/manual-payment/verification.service';
import { PaymentQueueTable } from './PaymentQueueTable';
import { PaymentAnalytics } from './PaymentAnalytics';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent } from '../../ui/card';
import { RefreshCw, Filter, Download, Bell } from 'lucide-react';

export const PaymentVerificationDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('queue');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const loadStats = async () => {
    try {
      const data = await paymentVerificationService.getPaymentStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleBulkVerify = async (paymentIds: string[]) => {
    // Implement bulk verification
  };

  const handleExport = async () => {
    // Implement export to Excel
  };

  if (!user || user.user_metadata?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">পেমেন্ট ভেরিফিকেশন</h1>
          <p className="text-gray-600">ম্যানুয়াল পেমেন্ট ভেরিফাই করুন</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.total || 0}</div>
                <div className="text-sm text-gray-600">মোট পেমেন্ট</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</div>
                <div className="text-sm text-gray-600">পেন্ডিং</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.verified || 0}</div>
                <div className="text-sm text-gray-600">ভেরিফাইড</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats.rejected || 0}</div>
                <div className="text-sm text-gray-600">রিজেক্টেড</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="queue">
            <Bell className="h-4 w-4 mr-2" />
            ভেরিফিকেশন কিউ ({stats?.today_pending || 0})
          </TabsTrigger>
          <TabsTrigger value="verified">
            <span className="text-green-600">✓</span> ভেরিফাইড
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <span className="text-red-600">✗</span> রিজেক্টেড
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Filter className="h-4 w-4 mr-2" />
            অ্যানালিটিক্স
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <PaymentQueueTable
            key={refreshKey}
            onRefresh={handleRefresh}
            onBulkVerify={handleBulkVerify}
          />
        </TabsContent>

        <TabsContent value="verified">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ভেরিফাইড পেমেন্টস</h3>
            {/* Add verified payments table */}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">রিজেক্টেড পেমেন্টস</h3>
            {/* Add rejected payments table */}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <PaymentAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};