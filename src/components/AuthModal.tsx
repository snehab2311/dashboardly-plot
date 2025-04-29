import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, redirectPath }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onClose();
    navigate('/signin', { state: { redirectPath } });
  };

  const handleSignUp = () => {
    onClose();
    navigate('/signup', { state: { redirectPath } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Become an User or Sign In!</DialogTitle>
          <DialogDescription>
            Please sign in or create an account to access this feature.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            onClick={handleSignIn}
            className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white"
          >
            Sign In
          </Button>
          <Button
            onClick={handleSignUp}
            variant="outline"
            className="border-dashboardly-primary text-dashboardly-primary hover:bg-dashboardly-primary/10"
          >
            Sign Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
