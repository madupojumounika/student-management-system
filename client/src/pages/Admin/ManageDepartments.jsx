import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Building2, Edit2, Trash2 } from 'lucide-react';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setName('');
    setShowModal(true);
  };

  const openEditModal = (dep) => {
    setEditId(dep.id);
    setName(dep.department_name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      alert('Failed to delete department');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/admin/departments/${editId}`, { department_name: name });
      } else {
        await axios.post('http://localhost:5000/api/admin/departments', { department_name: name });
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      alert(`Failed to ${editId ? 'update' : 'create'} department`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Departments</h1>
          <p className="text-slate-500 text-sm mt-1">View, edit, and add academic departments.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">ID</th>
              <th className="px-6 py-4 font-medium text-slate-500">Department Name</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-8">Loading...</td></tr>
            ) : departments.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-8 text-slate-500">No departments found</td></tr>
            ) : (
              departments.map((dep) => (
                <tr key={dep.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">{dep.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center space-x-3">
                    <Building2 size={18} className="text-indigo-400" />
                    <span>{dep.department_name}</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEditModal(dep)} className="text-indigo-600 hover:text-indigo-900">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(dep.id)} className="text-rose-600 hover:text-rose-900">
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
            <h2 className="text-xl font-bold text-slate-800 mb-4">{editId ? 'Edit Department' : 'Add New Department'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={name} onChange={(e) => setName(e.target.value)} 
                />
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

export default ManageDepartments;
