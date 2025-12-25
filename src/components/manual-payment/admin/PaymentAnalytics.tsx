// src/components/manual-payment/admin/PaymentAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, TrendingUp, Users, CreditCard, Calendar } from 'lucide-react';
import { paymentVerificationService } from '@/services/manual-payment/verification.service';

export const PaymentAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await paymentVerificationService.getPaymentStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">পেমেন্ট অ্যানালিটিক্স</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">মোট পেমেন্ট</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">আজকের পেমেন্ট</p>
                <p className="text-2xl font-bold">{stats?.today_pending || 0}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ভেরিফাইড</p>
                <p className="text-2xl font-bold text-green-600">{stats?.verified || 0}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">মোট টাকা</p>
                <p className="text-2xl font-bold text-green-600">৳{stats?.total_amount || 0}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">ওভারভিউ</TabsTrigger>
          <TabsTrigger value="methods">পদ্ধতি অনুযায়ী</TabsTrigger>
          <TabsTrigger value="timeline">টাইমলাইন</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>পেমেন্ট সারাংশ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>পেন্ডিং পেমেন্ট</span>
                  <span className="font-semibold">{stats?.pending || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>ভেরিফিকেশন চলছে</span>
                  <span className="font-semibold">{stats?.under_review || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>ভেরিফাইড পেমেন্ট</span>
                  <span className="font-semibold text-green-600">{stats?.verified || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>রিজেক্টেড পেমেন্ট</span>
                  <span className="font-semibold text-red-600">{stats?.rejected || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};