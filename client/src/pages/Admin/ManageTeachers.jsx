import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, UserCheck, Search, Edit2, Trash2 } from 'lucide-react';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', teacher_id: '',
    departmentId: '', qualification: ''
  });

  const fetchData = async () => {
    try {
      const [teachersRes, deptsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/teachers'),
        axios.get('http://localhost:5000/api/admin/departments')
      ]);
      setTeachers(teachersRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      username: '', email: '', password: '', teacher_id: '',
      departmentId: departments.length > 0 ? departments[0].id : '', qualification: ''
    });
    setShowModal(true);
  };

  const openEditModal = (t) => {
    setEditId(t.id);
    setFormData({
      username: t.user.username,
      email: t.user.email,
      password: '', // Password is not edited here
      teacher_id: t.teacher_id,
      departmentId: t.departmentId,
      qualification: t.qualification
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/teachers/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete teacher');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/admin/teachers/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/admin/teachers', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || `Failed to ${editId ? 'update' : 'create'} teacher`);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.teacher_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Teachers</h1>
          <p className="text-slate-500 text-sm mt-1">Directory of all faculty members.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search teachers..." 
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Teacher</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500">Teacher ID</th>
                <th className="px-6 py-4 font-medium text-slate-500">Name</th>
                <th className="px-6 py-4 font-medium text-slate-500">Email</th>
                <th className="px-6 py-4 font-medium text-slate-500">Department</th>
                <th className="px-6 py-4 font-medium text-slate-500">Qualification</th>
                <th className="px-6 py-4 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
              ) : filteredTeachers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No teachers found</td></tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-emerald-600">{teacher.teacher_id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                        {teacher.user.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{teacher.user.username}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{teacher.user.email}</td>
                    <td className="px-6 py-4 text-slate-600">{teacher.department?.department_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{teacher.qualification}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => openEditModal(teacher)} className="text-indigo-600 hover:text-indigo-900">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(teacher.id)} className="text-rose-600 hover:text-rose-900">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{editId ? 'Edit Teacher' : 'Add New Teacher'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                {!editId && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teacher ID</label>
                  <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.teacher_id} onChange={(e) => setFormData({...formData, teacher_id: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.departmentId} onChange={(e) => setFormData({...formData, departmentId: e.target.value})}>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
                  <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Save Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeachers;
