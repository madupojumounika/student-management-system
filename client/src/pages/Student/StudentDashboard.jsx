import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin, Building2, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/student/profile');
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-10">Loading Profile...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome, {user?.username}!</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 rounded-full bg-indigo-100 flex flex-col items-center justify-center shrink-0">
          <span className="text-5xl font-bold text-indigo-600">{user?.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 space-y-6 w-full">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.username}</h2>
            <p className="text-indigo-600 font-medium">Roll No: {profile?.student_id}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-slate-600">
              <User size={18} className="text-slate-400" />
              <span>Email: {user?.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-600">
              <Building2 size={18} className="text-slate-400" />
              <span>Department: {profile?.department?.department_name}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-600">
              <BookOpen size={18} className="text-slate-400" />
              <span>Semester {profile?.semester} - Section {profile?.section}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-600">
              <Phone size={18} className="text-slate-400" />
              <span>{profile?.phone || 'Not Provided'}</span>
            </div>
            <div className="flex items-start space-x-3 text-slate-600 sm:col-span-2">
              <MapPin size={18} className="text-slate-400 mt-1 shrink-0" />
              <span>{profile?.address || 'Not Provided'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
