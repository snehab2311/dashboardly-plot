import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: ''
  });

  const redirectPath = location.state?.redirectPath || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Sign up the user
      const { data: authData, error: authError } = await signUp(
        formData.email,
        formData.password
      );

      console.log('Signup response:', { authData, authError });
      
      if (authError) {
        if (authError.message.includes('already registered')) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "default"
          });
          setTimeout(() => navigate('/signin', { state: { redirectPath } }), 2000);
          return;
        }
        throw authError;
      }

      // Create profile only if we have a user ID
      if (authData?.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            name: formData.name,
            organization: formData.organization || null,
            role: formData.role || null,
            user_tier: 'free'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here, as signup was successful
        }
      }

      // Show success message
      toast({
        title: "Check Your Email",
        description: "We've sent you a verification link. Please check your email to complete signup.",
        variant: "default",
        duration: 6000
      });

      // Clear the form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization: '',
        role: ''
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/signuppagenew.png"
            alt="Data Analytics Dashboard"
            className="w-full h-full object-contain p-6"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <img
              src="/logo.png"
              alt="Dashboardly Logo"
              className="h-40 w-auto"
            />
          </div>

          <Card className="w-full shadow-lg border-2 border-[#4C1D95]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
              <CardDescription className="text-center">
                Start creating amazing dashboards today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization/Company (Optional)</Label>
                  <Input
                    id="organization"
                    name="organization"
                    type="text"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role/Occupation (Optional)</Label>
                  <Input
                    id="role"
                    name="role"
                    type="text"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Data Analyst"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-dashboardly-primary hover:bg-dashboardly-dark text-white"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{' '}
                  <Link 
                    to="/signin" 
                    state={{ redirectPath }}
                    className="font-medium text-dashboardly-primary hover:text-dashboardly-dark"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;