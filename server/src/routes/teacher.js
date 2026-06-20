const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);
router.use(authorize(['TEACHER']));

router.get('/dashboard', async (req, res) => {
  try {
    const teacherId = req.user.teacherId;
    const subjectsCount = await prisma.subject.count();
    
    res.json({
      assignedSubjects: subjectsCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher stats' });
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

router.post('/attendance', async (req, res) => {
  const { studentId, subjectId, status, date } = req.body;
  try {
    const attendance = await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        subjectId: parseInt(subjectId),
        status,
        attendance_date: date ? new Date(date) : new Date()
      }
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

router.post('/marks', async (req, res) => {
  const { studentId, subjectId, internal_marks, external_marks } = req.body;
  try {
    const total = parseFloat(internal_marks) + parseFloat(external_marks);
    const percentage = (total / 100) * 100; // Assuming 100 is max
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';

    const mark = await prisma.mark.upsert({
      where: {
        studentId_subjectId: { studentId: parseInt(studentId), subjectId: parseInt(subjectId) }
      },
      update: {
        internal_marks: parseFloat(internal_marks),
        external_marks: parseFloat(external_marks),
        total_marks: total,
        percentage,
        grade
      },
      create: {
        studentId: parseInt(studentId),
        subjectId: parseInt(subjectId),
        internal_marks: parseFloat(internal_marks),
        external_marks: parseFloat(external_marks),
        total_marks: total,
        percentage,
        grade
      }
    });
    res.json(mark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add marks' });
  }
});

router.get('/subjects/:subjectId/students', async (req, res) => {
  const { subjectId } = req.params;
  try {
    // Fetch all students instead of only enrolled ones to ensure teachers can see and mark them
    const students = await prisma.student.findMany({
      include: { user: true }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

module.exports = router;
