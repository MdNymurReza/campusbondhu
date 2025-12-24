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
        // Get the hash from the URL
        const hash = window.location.hash;
        if (hash) {
          // Parse the hash to get the access token
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            // Set the session manually
            const { data: { session }, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) throw error;

            if (session) {
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: 'অথেন্টিকেশন ব্যর্থ',
            description: 'লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
            variant: 'destructive',
          });
          navigate('/login');
          return;
        }

        if (session) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Callback error:', error);
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
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">অথেন্টিকেশন সম্পন্ন হচ্ছে...</p>
      </div>
    </div>
  );
};

export default Callback;