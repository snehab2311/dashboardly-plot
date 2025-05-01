import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        setIsVerifying(true);
        
        // Get the current session to check if verification was successful
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Current session:', session);
        console.log('Session error:', sessionError);

        if (session) {
          console.log('User is authenticated:', session.user);
          setVerificationStatus('success');
          return;
        }

        // If no session, check if we're in the verification process
        const params = new URLSearchParams(window.location.search);
        const isVerifying = params.get('redirect_type') === 'signup';
        
        if (!isVerifying) {
          console.log('Not in verification process');
          return;
        }

        // Give Supabase a moment to process the verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check session again
        const { data: { session: updatedSession } } = await supabase.auth.getSession();
        
        if (updatedSession) {
          console.log('Verification successful:', updatedSession.user);
          setVerificationStatus('success');
        } else {
          console.log('Verification failed: No session after redirect');
          setVerificationError('Verification failed. Please try signing up again.');
          setVerificationStatus('failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationError('An unexpected error occurred during verification');
        setVerificationStatus('failed');
      } finally {
        setIsVerifying(false);
      }
    };

    // Run verification when component mounts
    handleEmailVerification();
  }, [location]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verifying Email</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your email address...
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
            {verificationStatus === 'pending' && !verificationError && 'Email Verification'}
            {verificationStatus === 'success' && 'Verification Successful'}
            {(verificationStatus === 'failed' || verificationError) && 'Verification Failed'}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === 'pending' && !verificationError && 
              'Please use the verification link sent to your email'}
            {verificationStatus === 'success' && 
              'Your email has been verified successfully!'}
            {verificationError && 
              `Error: ${verificationError}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {(verificationStatus === 'failed' || verificationError) && (
            <>
              <div className="text-center text-sm text-gray-600">
                Please try signing up again
              </div>
              <Button
                onClick={() => navigate('/signup')}
                className="w-full"
              >
                Back to Sign Up
              </Button>
            </>
          )}
          
          {verificationStatus === 'success' && (
            <>
              <div className="text-center text-sm text-gray-600">
                You can now sign in to your account
              </div>
              <Button
                onClick={() => navigate('/signin')}
                className="w-full"
              >
                Continue to Sign In
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail; 