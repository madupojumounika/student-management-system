import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Award, BookOpen } from 'lucide-react';

const StudentMarks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/student/marks');
        setMarks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, []);

  if (loading) return <div className="text-center py-10">Loading Marks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Academic Marks</h1>
          <p className="text-slate-500 text-sm mt-1">View your grades and performance.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Subject</th>
              <th className="px-6 py-4 font-medium text-slate-500">Internal Marks</th>
              <th className="px-6 py-4 font-medium text-slate-500">External Marks</th>
              <th className="px-6 py-4 font-medium text-slate-500">Total</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {marks.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-500">No marks recorded yet.</td></tr>
            ) : (
              marks.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center space-x-3">
                    <BookOpen size={18} className="text-indigo-400" />
                    <span>{record.subject.subject_name} ({record.subject.subject_code})</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{record.internal_marks} / 40</td>
                  <td className="px-6 py-4 text-slate-600">{record.external_marks} / 60</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{record.total_marks} / 100</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700">
                      {record.grade}
                    </span>
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

export default StudentMarks;
