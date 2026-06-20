import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Users, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, subjectsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/teacher/dashboard'),
          axios.get('http://localhost:5000/api/teacher/subjects')
        ]);
        setStats(statsRes.data);
        setSubjects(subjectsRes.data);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;

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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Teacher Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, Prof. {user?.username}!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Assigned Subjects" value={stats?.assignedSubjects || 0} icon={BookOpen} color="bg-indigo-500 shadow-indigo-500/30 shadow-lg" />
        <StatCard title="Classes Pending" value="3" icon={Activity} color="bg-emerald-500 shadow-emerald-500/30 shadow-lg" />
      </div>

      <div className="mt-8 bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Your Subjects</h3>
        {subjects.length === 0 ? (
          <p className="text-slate-500 py-4 text-center">No subjects assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(sub => (
              <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <BookOpen size={18} className="text-indigo-500" />
                  <h4 className="font-bold text-slate-800">{sub.subject_code}</h4>
                </div>
                <p className="text-slate-600 font-medium mb-1">{sub.subject_name}</p>
                <div className="flex justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
                  <span>Semester {sub.semester}</span>
                  <span>{sub.credits} Credits</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
