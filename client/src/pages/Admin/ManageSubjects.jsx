import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, BookOpen, Edit2, Trash2 } from 'lucide-react';

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ subject_code: '', subject_name: '', semester: 1, credits: 3 });

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setFormData({ subject_code: '', subject_name: '', semester: 1, credits: 3 });
    setShowModal(true);
  };

  const openEditModal = (sub) => {
    setEditId(sub.id);
    setFormData({
      subject_code: sub.subject_code,
      subject_name: sub.subject_name,
      semester: sub.semester,
      credits: sub.credits
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      alert('Failed to delete subject');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/admin/subjects/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/admin/subjects', formData);
      }
      setShowModal(false);
      fetchSubjects();
    } catch (err) {
      alert(`Failed to ${editId ? 'update' : 'create'} subject`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Subjects</h1>
          <p className="text-slate-500 text-sm mt-1">View, edit, and add academic subjects.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Code</th>
              <th className="px-6 py-4 font-medium text-slate-500">Subject Name</th>
              <th className="px-6 py-4 font-medium text-slate-500">Semester</th>
              <th className="px-6 py-4 font-medium text-slate-500">Credits</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
            ) : subjects.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-500">No subjects found</td></tr>
            ) : (
              subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-indigo-600 font-semibold">{sub.subject_code}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center space-x-3">
                    <BookOpen size={18} className="text-indigo-400" />
                    <span>{sub.subject_name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">Sem {sub.semester}</td>
                  <td className="px-6 py-4 text-slate-600">{sub.credits}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEditModal(sub)} className="text-indigo-600 hover:text-indigo-900">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(sub.id)} className="text-rose-600 hover:text-rose-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{editId ? 'Edit Subject' : 'Add New Subject'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
                <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.subject_code} onChange={(e) => setFormData({...formData, subject_code: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.subject_name} onChange={(e) => setFormData({...formData, subject_name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                  <input type="number" required min="1" max="8" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Credits</label>
                  <input type="number" required min="1" max="6" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.credits} onChange={(e) => setFormData({...formData, credits: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubjects;
