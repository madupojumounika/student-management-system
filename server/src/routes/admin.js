const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);
router.use(authorize(['ADMIN']));

// Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalTeachers = await prisma.teacher.count();
    const totalSubjects = await prisma.subject.count();

    const totalAttendances = await prisma.attendance.count();
    const presentAttendances = await prisma.attendance.count({ where: { status: 'PRESENT' } });
    const averageAttendance = totalAttendances === 0 ? 0 : (presentAttendances / totalAttendances) * 100;

    res.json({
      totalStudents,
      totalTeachers,
      totalSubjects,
      averageAttendance: averageAttendance.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Students CRUD
router.post('/students', async (req, res) => {
  const { username, email, password, student_id, departmentId, semester, section, phone, address } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const subjects = await prisma.subject.findMany({
      where: { semester: parseInt(semester) }
    });

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'STUDENT',
        student: {
          create: {
            student_id,
            departmentId: parseInt(departmentId),
            semester: parseInt(semester),
            section,
            phone,
            address,
            subjects: {
              create: subjects.map(sub => ({ subjectId: sub.id }))
            }
          }
        }
      },
      include: { student: true }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Create student error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: `A user with this ${error.meta?.target?.join(', ')} already exists.` });
    }
    res.status(500).json({ error: error.message || 'Failed to create student' });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await prisma.student.findMany({ include: { user: true, department: true } });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, student_id, departmentId, semester, section, phone, address } = req.body;
  try {
    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        student_id, departmentId: parseInt(departmentId), semester: parseInt(semester), section, phone, address,
        user: { update: { username, email } }
      },
      include: { user: true }
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

router.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({ where: { id: parseInt(id) } });
    if (student) await prisma.user.delete({ where: { id: student.userId } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Teachers CRUD
router.post('/teachers', async (req, res) => {
  const { username, email, password, teacher_id, departmentId, qualification } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const subjects = await prisma.subject.findMany();

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'TEACHER',
        teacher: {
          create: {
            teacher_id,
            departmentId: parseInt(departmentId),
            qualification,
            subjects: {
              create: subjects.map(sub => ({ subjectId: sub.id }))
            }
          }
        }
      },
      include: { teacher: true }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Create teacher error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: `A teacher with this ${error.meta?.target?.join(', ')} already exists.` });
    }
    res.status(500).json({ error: error.message || 'Failed to create teacher' });
  }
});

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({ include: { user: true, department: true } });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

router.put('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, teacher_id, departmentId, qualification } = req.body;
  try {
    const teacher = await prisma.teacher.update({
      where: { id: parseInt(id) },
      data: {
        teacher_id, departmentId: parseInt(departmentId), qualification,
        user: { update: { username, email } }
      },
      include: { user: true }
    });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

router.delete('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id: parseInt(id) } });
    if (teacher) await prisma.user.delete({ where: { id: teacher.userId } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

// Departments CRUD
router.post('/departments', async (req, res) => {
  const { department_name } = req.body;
  try {
    const department = await prisma.department.create({
      data: { department_name }
    });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department' });
  }
});

router.get('/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

router.put('/departments/:id', async (req, res) => {
  const { id } = req.params;
  const { department_name } = req.body;
  try {
    const updated = await prisma.department.update({
      where: { id: parseInt(id) },
      data: { department_name }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

router.delete('/departments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.department.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// Subjects CRUD
router.post('/subjects', async (req, res) => {
  const { subject_code, subject_name, semester, credits } = req.body;
  try {
    const targetSemester = parseInt(semester);
    
    // Find all students in this semester and all teachers
    const students = await prisma.student.findMany({
      where: { semester: targetSemester }
    });
    const teachers = await prisma.teacher.findMany();

    const subject = await prisma.subject.create({
      data: {
        subject_code,
        subject_name,
        semester: targetSemester,
        credits: parseInt(credits),
        students: {
          create: students.map(st => ({ studentId: st.id }))
        },
        teachers: {
          create: teachers.map(tc => ({ teacherId: tc.id }))
        }
      }
    });
    res.status(201).json(subject);
  } catch (error) {
    console.error('Create subject error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: `A subject with this ${error.meta?.target?.join(', ')} already exists.` });
    }
    res.status(500).json({ error: error.message || 'Failed to create subject' });
  }
});

router.get('/subjects', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

router.put('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  const { subject_code, subject_name, semester, credits } = req.body;
  try {
    const updated = await prisma.subject.update({
      where: { id: parseInt(id) },
      data: { subject_code, subject_name, semester: parseInt(semester), credits: parseInt(credits) }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

router.delete('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.subject.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

// Admins CRUD
router.get('/admins', async (req, res) => {
  try {
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

router.delete('/admins/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete admin' });
  }
});

module.exports = router;

