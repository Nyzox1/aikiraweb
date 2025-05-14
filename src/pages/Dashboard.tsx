import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Loader2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();
      if (error || !data) {
        setUsername(null);
      } else {
        setUsername(data.username);
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 text-primary-main animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="bg-gray-800/80 rounded-2xl shadow-glow p-8 border border-primary-main/20 flex flex-col items-center">
        <User className="h-12 w-12 text-primary-main mb-4" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent mb-2">
          Welcome, {username}!
        </h1>
        <p className="text-gray-400 mb-4">This is your dashboard. More features coming soon!</p>
      </div>
    </div>
  );
};

export default Dashboard; 