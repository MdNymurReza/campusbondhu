// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Save, Loader2, Calendar, Shield, Edit } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Get user metadata
        setProfile({
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
        });
        
        // Get additional profile data from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(prev => ({
            ...prev,
            full_name: data.full_name || prev.full_name,
          }));
          setLastUpdated(data.updated_at ? new Date(data.updated_at).toLocaleDateString('bn-BD') : '');
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Update in auth metadata
      const { error } = await updateProfile({
        full_name: profile.full_name,
      });
      
      if (!error) {
        // Also update in profiles table
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: profile.full_name,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
        
        if (!updateError) {
          setLastUpdated(new Date().toLocaleDateString('bn-BD'));
          alert("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
        } else {
          throw updateError;
        }
      } else {
        throw error;
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert("প্রোফাইল আপডেট ব্যর্থ: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">লগইন প্রয়োজন</h1>
            <p className="text-gray-600 mb-6">এই পৃষ্ঠা দেখতে লগইন করুন</p>
            <Button asChild>
              <a href="/login">লগইন করুন</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">আপনার প্রোফাইল</h1>
              <p className="text-gray-600 mt-2">আপনার ব্যক্তিগত তথ্য দেখুন এবং আপডেট করুন</p>
            </div>
            
            <div className="bg-white rounded-2xl border shadow-sm">
              {/* Profile Header */}
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {(profile.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {profile.full_name || user.email?.split('@')[0] || 'ব্যবহারকারী'}
                      </h2>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  {lastUpdated && (
                    <p className="text-sm text-gray-500">
                      সর্বশেষ আপডেট: {lastUpdated}
                    </p>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        পূর্ণ নাম
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="full_name"
                          value={profile.full_name}
                          onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                          className="pl-10"
                          placeholder="আপনার পূর্ণ নাম"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        এই নামটি আপনার সার্টিফিকেট এবং ড্যাশবোর্ডে দেখানো হবে
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        ইমেইল ঠিকানা
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          value={profile.email}
                          className="pl-10"
                          disabled
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        ইমেইল পরিবর্তন করতে আমাদের সাপোর্টে যোগাযোগ করুন
                      </p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">অ্যাকাউন্ট তথ্য</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">অ্যাকাউন্ট তৈরি</span>
                        </div>
                        <p className="text-gray-900">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString('bn-BD') : 'অজানা'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">ইমেইল স্ট্যাটাস</span>
                        </div>
                        <p className={`font-medium ${user.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}`}>
                          {user.email_confirmed_at ? 'যাচাইকৃত' : 'যাচাই প্রয়োজন'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">শেষ লগইন</span>
                        </div>
                        <p className="text-gray-900">
                          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('bn-BD') : 'অজানা'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">অ্যাকাউন্ট আইডি</span>
                        </div>
                        <p className="text-gray-900 text-sm truncate">{user.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            সেভ হচ্ছে...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            পরিবর্তনগুলি সেভ করুন
                          </>
                        )}
                      </Button>
                      
                      <Button variant="outline" asChild>
                        <a href="/dashboard">ড্যাশবোর্ডে ফিরুন</a>
                      </Button>
                      
                      <Button variant="outline" asChild>
                        <a href="/courses">কোর্স ব্রাউজ করুন</a>
                      </Button>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <h4 className="font-medium text-gray-900">অ্যাকাউন্ট ম্যানেজমেন্ট</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-gray-600">
                          পাসওয়ার্ড পরিবর্তন করুন
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-gray-600">
                          ইমেইল পরিবর্তন করুন
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                          অ্যাকাউন্ট ডিলিট করুন
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;