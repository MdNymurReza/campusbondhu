import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Save, Loader2 } from "lucide-react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
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
      }
      
      setIsLoading(false);
    };
    
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    // Update in auth metadata
    const { error } = await updateProfile({
      full_name: profile.full_name,
    });
    
    if (!error) {
      // Also update in profiles table
      await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      alert("প্রোফাইল আপডেট করা হয়েছে!");
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">আপনার প্রোফাইল</h1>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>প্রোফাইল ছবি</Label>
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <Button variant="outline">ছবি পরিবর্তন করুন</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="full_name">পূর্ণ নাম</Label>
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">ইমেইল</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              value={profile.email}
              className="pl-10"
              disabled
            />
          </div>
          <p className="text-sm text-gray-500">ইমেইল পরিবর্তন করতে নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>
        
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              সেভ হচ্ছে...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              সেভ করুন
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Profile;