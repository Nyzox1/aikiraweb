import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../supabase/client';

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Look up the user's email in the 'users' table using the provided username.
      // This requires your 'users' table to have a 'username' and 'email' column,
      // and RLS should allow this query (e.g., select on username).
      const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, id')
      .eq('username', username)
      .maybeSingle(); // ici
    
    if (userError || !userData) {
      throw new Error('Incorrect username or password');
    }
    
      

      // Get the email from the found user data
      const email = userData.email;

      // Step 2: Authenticate the user using the retrieved email and the provided password.
      // Supabase's built-in auth works with email and password.
      const { data, error } = await supabase.auth.signInWithPassword({
        email,    // Use the email found in Step 1
        password, // Use the password entered by the user
      });

      // If authentication fails with email/password
      if (error) {
          // Again, for security, provide a generic error message
          throw new Error('Incorrect username or password');
      }

      // Check if user object is returned successfully
      const user = data.user;
      if (!user) {
          // Should not happen if there's no error, but good practice
          throw new Error('Sign in failed: User not found');
      }

      // Authentication successful
      toast.success('Welcome back!');
      navigate('/dashboard'); // Redirect to dashboard or desired page

    } catch (err: any) {
      // Catch any errors from either the lookup or the sign-in process
      toast.error(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800/80 rounded-2xl shadow-glow p-8 border border-primary-main/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent mb-2">
            Sign in
          </h2>
          <p className="text-gray-400 mb-6">Access your account</p>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-main" size={18} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
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
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in'}
          </button>
        </form>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/signup')}
            className="text-sm text-white bg-primary-main/20 px-4 py-2 rounded-lg hover:bg-primary-main/40 transition-colors"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;