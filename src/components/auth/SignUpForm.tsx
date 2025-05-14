import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, Mail, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../supabase/client';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check if username exists
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .eq('username', username);

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Username already taken');
      }

      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile in users table
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          username,
          role: 'buyer',
        },
      ]);

      if (profileError) throw profileError;

      toast.success('Account created successfully! Please check your email.');
      navigate('/signin');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800/80 rounded-2xl shadow-glow p-8 border border-primary-main/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent mb-2">
            Sign up
          </h2>
          <p className="text-gray-400 mb-6">Create your account</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-main" size={18} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-primary pl-10"
                  placeholder="Username"
                />
              </div>
            </div>
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
                  autoComplete="new-password"
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
            className="w-full flex justify-center items-center gap-2 bg-primary-main text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-primary-light transition-colors duration-200"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign up'}
          </button>
        </form>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/signin')}
            className="text-sm text-primary-main hover:text-primary-light transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;