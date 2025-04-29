import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Successful Verification</CardTitle>
          <CardDescription className="text-center">
            Your email has been verified successfully!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="text-center text-sm text-gray-600">
            You can now sign in to your account
          </div>
          <Button
            onClick={() => navigate('/signin')}
            className="w-full"
          >
            Continue to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail; 