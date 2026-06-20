import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarCheck, AlertCircle } from 'lucide-react';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/student/attendance');
        setAttendance(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <div className="text-center py-10">Loading Attendance...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">View your daily attendance records.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Date</th>
              <th className="px-6 py-4 font-medium text-slate-500">Subject</th>
              <th className="px-6 py-4 font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {attendance.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-8 text-slate-500">No attendance records found.</td></tr>
            ) : (
              attendance.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(record.attendance_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {record.subject.subject_name} ({record.subject.subject_code})
                  </td>
                  <td className="px-6 py-4">
                    {record.status === 'PRESENT' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CalendarCheck size={14} className="mr-1" /> Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        <AlertCircle size={14} className="mr-1" /> Absent
                      </span>
                    )}
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

export default StudentAttendance;
