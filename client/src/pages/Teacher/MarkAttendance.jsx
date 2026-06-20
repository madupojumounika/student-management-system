import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Users } from 'lucide-react';

const MarkAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/teacher/subjects');
        setSubjects(res.data);
        if (res.data.length > 0) {
          setSelectedSubject(res.data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/teacher/subjects/${selectedSubject}/students`);
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, [selectedSubject]);

  const handleMark = async (studentId, status) => {
    try {
      await axios.post('http://localhost:5000/api/teacher/attendance', {
        studentId,
        subjectId: selectedSubject,
        status,
        date
      });
      alert(`Marked ${status} successfully!`);
    } catch (err) {
      alert('Failed or already marked for this date.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Mark Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">Record daily student attendance.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Subject</label>
          <select 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name} ({s.subject_code})</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="date" 
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Student ID</th>
              <th className="px-6 py-4 font-medium text-slate-500">Name</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-8 text-slate-500">No students enrolled.</td></tr>
            ) : (
              students.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-indigo-600">{student.student_id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center space-x-3">
                    <Users size={18} className="text-slate-400" />
                    <span>{student.user.username}</span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button 
                      onClick={() => handleMark(student.id, 'PRESENT')}
                      className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium transition-colors"
                    >
                      Present
                    </button>
                    <button 
                      onClick={() => handleMark(student.id, 'ABSENT')}
                      className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 font-medium transition-colors"
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarkAttendance;
