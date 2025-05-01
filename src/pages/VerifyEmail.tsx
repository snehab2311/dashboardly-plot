import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Try to get token from both hash and search params
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const searchParams = new URLSearchParams(location.search);
        
        // Check both hash and query parameters for the token
        const token = hashParams.get('access_token') || 
                     searchParams.get('token') || 
                     searchParams.get('access_token');

        if (!token) {
          console.error('No token found in URL');
          console.log('URL:', window.location.href);
          console.log('Hash:', location.hash);
          console.log('Search:', location.search);
          setVerificationError('No verification token found');
          return;
        }

        // Verify the token
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          console.error('Verification error:', error);
          setVerificationError(error.message);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationError('An error occurred during verification');
      }
    };

    handleEmailVerification();
  }, [location]);

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