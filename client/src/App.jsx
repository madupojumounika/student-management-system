import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageDepartments from './pages/Admin/ManageDepartments';
import ManageSubjects from './pages/Admin/ManageSubjects';
import ManageStudents from './pages/Admin/ManageStudents';
import ManageTeachers from './pages/Admin/ManageTeachers';

import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import MarkAttendance from './pages/Teacher/MarkAttendance';
import ManageMarks from './pages/Teacher/ManageMarks';

import StudentDashboard from './pages/Student/StudentDashboard';
import StudentAttendance from './pages/Student/StudentAttendance';
import StudentMarks from './pages/Student/StudentMarks';
import SelectSubjects from './pages/Student/SelectSubjects';

import Profile from './pages/Profile/Profile';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="departments" element={<ManageDepartments />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="teachers" element={<ManageTeachers />} />
            <Route path="subjects" element={<ManageSubjects />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Teacher Routes */}
          <Route path="/teacher" element={
            <ProtectedRoute roles={['TEACHER']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="attendance" element={<MarkAttendance />} />
            <Route path="marks" element={<ManageMarks />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute roles={['STUDENT']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="subjects" element={<SelectSubjects />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="marks" element={<StudentMarks />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
