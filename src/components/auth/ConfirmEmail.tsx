// src/pages/auth/ConfirmEmail.tsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Mail, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resendConfirmationEmail } = useAuth();
  const [status, setStatus] = useState<'loading' | 'sent' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const emailParam = searchParams.get('email');
    const sentParam = searchParams.get('sent');

    if (emailParam) {
      setEmail(emailParam);
    }

    if (sentParam === 'true') {
      setStatus('sent');
      setMessage('কনফার্মেশন ইমেইল পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেইল চেক করুন।');
      return;
    }

    if (token && type === 'signup') {
      confirmEmail(token);
    } else {
      setStatus('error');
      setMessage('ইনভ্যালিড কনফার্মেশন লিংক।');
    }
  }, [searchParams]);

  const confirmEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });

      if (error) throw error;

      setStatus('success');
      setMessage('আপনার ইমেইল সফলভাবে যাচাই করা হয়েছে! এখন আপনি লগইন করতে পারেন।');
      
      toast({
        title: 'ইমেইল যাচাই সফল!',
        description: 'আপনার অ্যাকাউন্ট এখন সক্রিয় হয়েছে।',
      });
    } catch (error: any) {
      console.error('Email confirmation error:', error);
      setStatus('error');
      setMessage(error.message || 'ইমেইল যাচাই ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: 'ইমেইল প্রয়োজন',
        description: 'অনুগ্রহ করে ইমেইল ঠিকানা লিখুন।',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await resendConfirmationEmail(email);
    if (!error) {
      setStatus('sent');
      setMessage('কনফার্মেশন ইমেইল আবার পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেইল চেক করুন।');
    }
  };

  return (
    <>
      <Helmet>
        <title>ইমেইল যাচাই - ক্যাম্পাসবন্ধু</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="space-y-4">
            {status === 'loading' && (
              <>
                <div className="h-16 w-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  ইমেইল যাচাই করা হচ্ছে...
                </h1>
                <p className="text-muted-foreground">
                  অনুগ্রহ করে অপেক্ষা করুন
                </p>
              </>
            )}

            {status === 'sent' && (
              <>
                <div className="h-16 w-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  কনফার্মেশন ইমেইল পাঠানো হয়েছে
                </h1>
                <p className="text-muted-foreground">{message}</p>
                <div className="space-y-3">
                  {email && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleResendEmail}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      ইমেইল আবার পাঠান
                    </Button>
                  )}
                  <Link to="/login">
                    <Button variant="hero" className="w-full">
                      লগইন করুন
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="h-16 w-16 rounded-full bg-success/10 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  ইমেইল যাচাই সফল!
                </h1>
                <p className="text-muted-foreground">{message}</p>
                <Link to="/login">
                  <Button variant="hero" className="w-full">
                    লগইন করুন
                  </Button>
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="h-16 w-16 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  যাচাই ব্যর্থ
                </h1>
                <p className="text-muted-foreground">{message}</p>
                <div className="space-y-3">
                  {email && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleResendEmail}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      কনফার্মেশন ইমেইল আবার পাঠান
                    </Button>
                  )}
                  <Link to="/register">
                    <Button variant="outline" className="w-full">
                      আবার রেজিস্টার করুন
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="hero" className="w-full">
                      লগইন করুন
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {status !== 'loading' && (
            <p className="text-sm text-muted-foreground">
              সমস্যা হলে{' '}
              <Link to="/contact" className="text-primary hover:underline">
                আমাদের সাথে যোগাযোগ করুন
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfirmEmail;