// src/pages/auth/Callback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Callback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing auth callback...');
        
        // Check for OAuth errors first
        const urlParams = new URLSearchParams(window.location.search);
        const oauthError = urlParams.get('error'); // Renamed to oauthError
        const errorDescription = urlParams.get('error_description');
        
        if (oauthError) {
          console.error('OAuth error:', oauthError, errorDescription);
          toast({
            title: 'OAuth লগইন ব্যর্থ',
            description: errorDescription || 'Google/GitHub লগইনে সমস্যা হয়েছে।',
            variant: 'destructive',
          });
          navigate('/login');
          return;
        }

        // Get the hash from the URL for PKCE flow
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          console.log('🔑 Found access token in hash');
          // Parse the hash to get the access token
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            console.log('🔄 Setting session from hash...');
            // Set the session manually
            const { data: { session }, error: sessionError } = await supabase.auth.setSession({ // Renamed to sessionError
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error('Session set error:', sessionError);
              throw sessionError;
            }

            if (session) {
              console.log('✅ Session set successfully for:', session.user.email);
              toast({
                title: 'লগইন সফল!',
                description: 'স্বাগতম!',
              });
              navigate('/dashboard');
              return;
            }
          }
        }

        // Fallback: check current session
        console.log('🔄 Checking current session...');
        const { data: { session }, error: getSessionError } = await supabase.auth.getSession(); // Renamed to getSessionError
        
        if (getSessionError) {
          console.error('Auth session check error:', getSessionError);
          toast({
            title: 'অথেন্টিকেশন ব্যর্থ',
            description: 'লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
            variant: 'destructive',
          });
          navigate('/login');
          return;
        }

        if (session) {
          console.log('✅ Existing session found for:', session.user.email);
          navigate('/dashboard');
        } else {
          console.log('❌ No session found, redirecting to login');
          navigate('/login');
        }
      } catch (error: any) {
        console.error('❌ Callback error:', error);
        toast({
          title: 'ত্রুটি হয়েছে',
          description: 'অথেন্টিকেশন প্রক্রিয়ায় একটি ত্রুটি হয়েছে।',
          variant: 'destructive',
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">অথেন্টিকেশন সম্পন্ন হচ্ছে...</p>
        <p className="text-sm text-gray-500 mt-2">অনুগ্রহ করে অপেক্ষা করুন</p>
      </div>
    </div>
  );
};

export default Callback;