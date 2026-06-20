import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Check } from 'lucide-react';

const SelectSubjects = () => {
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [availableRes, enrolledRes] = await Promise.all([
        axios.get('http://localhost:5000/api/student/subjects/available'),
        axios.get('http://localhost:5000/api/student/subjects')
      ]);
      setAvailableSubjects(availableRes.data);
      setEnrolledSubjects(enrolledRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (subjectId) => {
    try {
      await axios.post('http://localhost:5000/api/student/subjects/enroll', { subjectId });
      alert('Successfully enrolled in subject!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to enroll');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Subject Registration</h1>
        <p className="text-slate-500 text-sm mt-1">Enroll in subjects for your current semester.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Subjects */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-800 flex items-center space-x-2">
              <BookOpen size={18} className="text-indigo-600" />
              <span>Available Subjects</span>
            </h2>
          </div>
          <div className="p-0">
            {availableSubjects.length === 0 ? (
              <p className="text-slate-500 text-center py-6">No available subjects to enroll.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {availableSubjects.map(subject => (
                  <li key={subject.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-800">{subject.subject_name}</p>
                      <p className="text-sm text-slate-500">{subject.subject_code} • {subject.credits} Credits • Sem {subject.semester}</p>
                    </div>
                    <button 
                      onClick={() => handleEnroll(subject.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus size={16} />
                      <span>Enroll</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Enrolled Subjects */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-800 flex items-center space-x-2">
              <Check size={18} className="text-emerald-600" />
              <span>Currently Enrolled</span>
            </h2>
          </div>
          <div className="p-0">
            {enrolledSubjects.length === 0 ? (
              <p className="text-slate-500 text-center py-6">You are not enrolled in any subjects yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {enrolledSubjects.map(subject => (
                  <li key={subject.id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-800">{subject.subject_name}</p>
                      <p className="text-sm text-slate-500">{subject.subject_code} • {subject.credits} Credits</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Enrolled</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectSubjects;
