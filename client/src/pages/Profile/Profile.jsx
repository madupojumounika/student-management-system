import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Building2, BookOpen } from 'lucide-react';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setProfile(res.data);
      setFormData({ username: res.data.username, email: res.data.email });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/auth/me', formData);
      setEditing(false);
      fetchProfile();
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center py-12">Loading profile...</div>;
  if (!profile) return <div className="text-center py-12 text-red-500">Failed to load profile</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 h-32 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full p-2 shadow-lg">
            <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="pt-16 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{profile.username}</h2>
              <div className="flex items-center text-slate-500 mt-1 space-x-2">
                <Shield size={16} />
                <span className="text-sm font-medium">{profile.role}</span>
              </div>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">Save Changes</button>
                <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Account Details</h3>
                <div className="flex items-center space-x-3 text-slate-600">
                  <User size={18} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Username</p>
                    <p className="font-medium">{profile.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <Mail size={18} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Email Address</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
              </div>

              {profile.teacher && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Faculty Details</h3>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <BookOpen size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Teacher ID</p>
                      <p className="font-medium">{profile.teacher.teacher_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Building2 size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Department</p>
                      <p className="font-medium">{profile.teacher.department?.department_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Shield size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Qualification</p>
                      <p className="font-medium">{profile.teacher.qualification}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {profile.student && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Student Details</h3>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <BookOpen size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Student ID</p>
                      <p className="font-medium">{profile.student.student_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Building2 size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Department</p>
                      <p className="font-medium">{profile.student.department?.department_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <User size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Semester / Section</p>
                      <p className="font-medium">Sem {profile.student.semester} - Section {profile.student.section}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
