import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserCheck, BookOpen, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;

  const data = [
    { name: 'Students', value: stats?.totalStudents || 0 },
    { name: 'Teachers', value: stats?.totalTeachers || 0 },
    { name: 'Subjects', value: stats?.totalSubjects || 0 },
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between transition-transform hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back to the administrative portal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={Users} color="bg-blue-500 shadow-blue-500/30 shadow-lg" />
        <StatCard title="Total Teachers" value={stats?.totalTeachers || 0} icon={UserCheck} color="bg-emerald-500 shadow-emerald-500/30 shadow-lg" />
        <StatCard title="Total Subjects" value={stats?.totalSubjects || 0} icon={BookOpen} color="bg-purple-500 shadow-purple-500/30 shadow-lg" />
        <StatCard title="Avg Attendance" value={`${stats?.averageAttendance || 0}%`} icon={Activity} color="bg-orange-500 shadow-orange-500/30 shadow-lg" />
      </div>

      <div className="mt-8 bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Institution Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
