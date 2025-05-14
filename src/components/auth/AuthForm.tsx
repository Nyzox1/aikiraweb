import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        await signUp(email, password);
        toast.success('Check your email to confirm your account');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800/80 rounded-2xl shadow-glow p-8 border border-primary-main/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent mb-2">
            {mode === 'signin' ? 'Sign in' : 'Sign up'}
          </h2>
          <p className="text-gray-400 mb-6">
            {mode === 'signin' ? 'Access your account' : 'Create your account'}
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-main" size={18} />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  className="input-primary pl-10"
                placeholder="Email address"
              />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-main" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  className="input-primary pl-10"
                placeholder="Password"
              />
              </div>
            </div>
          </div>

            <button
              type="submit"
              disabled={loading}
            className="btn-primary w-full flex justify-center items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : mode === 'signin' ? (
                'Sign in'
              ) : (
                'Sign up'
              )}
            </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate(mode === 'signin' ? '/signup' : '/signin')}
            className="text-sm text-primary-main hover:text-primary-light transition-colors"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;