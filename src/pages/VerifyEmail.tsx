import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Debug logging
        console.log('Verification page loaded');
        console.log('Full URL:', window.location.href);
        console.log('Hash:', location.hash);
        console.log('Search params:', location.search);
        console.log('Pathname:', location.pathname);

        // Get the token from URL
        const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
        const searchParams = new URLSearchParams(location.search);
        
        // Check all possible token locations
        const token = hashParams.get('access_token') || 
                     searchParams.get('token') || 
                     searchParams.get('access_token');

        if (!token) {
          console.error('No token found in URL. Debug info:', {
            fullUrl: window.location.href,
            hash: location.hash,
            search: location.search,
            pathname: location.pathname
          });
          setVerificationError('No verification token found in URL');
          setIsVerifying(false);
          return;
        }

        console.log('Found token, attempting verification...');

        // Try to verify with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        console.log('Verification response:', { data, error });

        if (error) {
          console.error('Verification failed:', error);
          setVerificationError(error.message);
        } else {
          console.log('Verification successful:', data);
        }

        setIsVerifying(false);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationError('An unexpected error occurred during verification');
        setIsVerifying(false);
      }
    };

    handleEmailVerification();
  }, [location]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verifying Email</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your email...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {verificationError ? 'Verification Failed' : 'Successful Verification'}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationError 
              ? `Error: ${verificationError}`
              : 'Your email has been verified successfully!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="text-center text-sm text-gray-600">
            {verificationError 
              ? 'Please try signing up again'
              : 'You can now sign in to your account'}
          </div>
          <Button
            onClick={() => navigate(verificationError ? '/signup' : '/signin')}
            className="w-full"
          >
            {verificationError ? 'Back to Sign Up' : 'Continue to Sign In'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail; 