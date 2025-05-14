import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, FileText, Settings, ChevronRight } from 'lucide-react';
import { supabase } from '../../supabase/client';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: usersData }, { data: ordersData }, { data: appsData }] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('seller_applications').select('*'),
      ]);
      setUsers(usersData || []);
      setOrders(ordersData || []);
      setApplications(appsData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'applications', label: 'Applications', icon: FileText },
  ];
  
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-800/50 rounded-xl border border-primary-main/20 p-4">
              <h2 className="text-xl font-semibold text-white mb-4">Admin Panel</h2>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
        <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-main/20 text-primary-main'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{tab.label}</span>
                      <ChevronRight
                        size={16}
                        className={`ml-auto transition-transform duration-200 ${
                          activeTab === tab.id ? 'rotate-90' : ''
                        }`}
                      />
        </button>
                  );
                })}
              </nav>
      </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-800/50 rounded-xl border border-primary-main/20 p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-700/50 rounded-xl p-6 border border-primary-main/20">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-main/20 flex items-center justify-center">
                          <Users className="text-primary-main" size={24} />
                        </div>
                        <div>
                          <p className="text-gray-400">Total Users</p>
                          <p className="text-2xl font-bold text-white">{users.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-6 border border-primary-main/20">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-main/20 flex items-center justify-center">
                          <ShoppingBag className="text-primary-main" size={24} />
                        </div>
                        <div>
                          <p className="text-gray-400">Active Orders</p>
                          <p className="text-2xl font-bold text-white">{orders.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-6 border border-primary-main/20">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-main/20 flex items-center justify-center">
                          <FileText className="text-primary-main" size={24} />
                        </div>
                        <div>
                          <p className="text-gray-400">Pending Applications</p>
                          <p className="text-2xl font-bold text-white">{applications.length}</p>
                        </div>
                      </div>
                    </div>
        </div>
      </div>
              )}
      
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
      <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-700">
                          <th className="pb-4 text-gray-400">User</th>
                          <th className="pb-4 text-gray-400">Role</th>
                          <th className="pb-4 text-gray-400">Email</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                          <tr key={user.id} className="text-gray-300">
                            <td className="py-4">{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Order Management</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-700">
                          <th className="pb-4 text-gray-400">Order ID</th>
                          <th className="pb-4 text-gray-400">User</th>
                          <th className="pb-4 text-gray-400">Gamepass</th>
                          <th className="pb-4 text-gray-400">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {orders.map((order) => (
                          <tr key={order.id} className="text-gray-300">
                            <td className="py-4">{order.id}</td>
                            <td>{order.user_id}</td>
                            <td>{order.gamepass_id}</td>
                            <td>{order.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'applications' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Seller Applications</h2>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-gray-700/50 rounded-xl p-6 border border-primary-main/20"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Application #{app.id}</h3>
                            <p className="text-gray-400">Submitted {app.created_at}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
                            {app.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-400">User ID</p>
                            <p className="text-white">{app.user_id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Description</p>
                            <p className="text-white">{app.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;