import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Award } from 'lucide-react';

const ManageMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Instead of a single form data, we keep marks in a map: { studentId: { internal_marks, external_marks } }
  const [marksState, setMarksState] = useState({});

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
        // Initialize marks state
        const initialMarks = {};
        res.data.forEach(s => {
          initialMarks[s.id] = { internal_marks: '', external_marks: '' };
        });
        setMarksState(initialMarks);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, [selectedSubject]);

  const handleMarkChange = (studentId, field, value) => {
    setMarksState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSave = async (studentId) => {
    const data = marksState[studentId];
    if (!data.internal_marks || !data.external_marks) {
      alert("Please enter both internal and external marks");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/teacher/marks', {
        studentId,
        subjectId: selectedSubject,
        internal_marks: data.internal_marks,
        external_marks: data.external_marks
      });
      alert(`Marks saved successfully!`);
    } catch (err) {
      alert('Failed to save marks.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Marks</h1>
          <p className="text-slate-500 text-sm mt-1">Assign internal and external marks.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-6 mb-6">
        <div className="flex-1 max-w-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Subject</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full appearance-none bg-white"
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name} ({s.subject_code})</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Student ID</th>
              <th className="px-6 py-4 font-medium text-slate-500">Name</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-center">Internal (Max 40)</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-center">External (Max 60)</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-500">No students enrolled.</td></tr>
            ) : (
              students.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-indigo-600">{student.student_id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{student.user.username}</td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="number" min="0" max="40"
                      className="w-24 px-3 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                      value={marksState[student.id]?.internal_marks || ''}
                      onChange={(e) => handleMarkChange(student.id, 'internal_marks', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="number" min="0" max="60"
                      className="w-24 px-3 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                      value={marksState[student.id]?.external_marks || ''}
                      onChange={(e) => handleMarkChange(student.id, 'external_marks', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleSave(student.id)}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                    >
                      <Award size={16} />
                      <span>Save</span>
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

export default ManageMarks;
