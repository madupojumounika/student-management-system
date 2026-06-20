import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, LogOut, User } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (user?.role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Departments', path: '/admin/departments', icon: <BookOpen size={20} /> },
        { name: 'Students', path: '/admin/students', icon: <Users size={20} /> },
        { name: 'Teachers', path: '/admin/teachers', icon: <Users size={20} /> },
        { name: 'Subjects', path: '/admin/subjects', icon: <BookOpen size={20} /> },
        { name: 'Profile', path: '/admin/profile', icon: <User size={20} /> },
      ];
    } else if (user?.role === 'TEACHER') {
      return [
        { name: 'Dashboard', path: '/teacher/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Attendance', path: '/teacher/attendance', icon: <Users size={20} /> },
        { name: 'Marks', path: '/teacher/marks', icon: <BookOpen size={20} /> },
        { name: 'Profile', path: '/teacher/profile', icon: <User size={20} /> },
      ];
    } else {
      return [
        { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Subjects', path: '/student/subjects', icon: <BookOpen size={20} /> },
        { name: 'My Attendance', path: '/student/attendance', icon: <Users size={20} /> },
        { name: 'My Marks', path: '/student/marks', icon: <BookOpen size={20} /> },
        { name: 'Profile', path: '/student/profile', icon: <User size={20} /> },
      ];
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-4 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-xl font-bold text-center tracking-wider">SMS PORTAL</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {getLinks().map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-600' : 'hover:bg-slate-800'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-slate-800 transition-colors text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
