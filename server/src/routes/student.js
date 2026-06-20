const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);
router.use(authorize(['STUDENT']));

router.get('/profile', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.studentId },
      include: { user: true, department: true }
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/attendance', async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: req.user.studentId },
      include: { subject: true },
      orderBy: { attendance_date: 'desc' }
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

router.get('/marks', async (req, res) => {
  try {
    const marks = await prisma.mark.findMany({
      where: { studentId: req.user.studentId },
      include: { subject: true }
    });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// Subject selection endpoints
router.get('/subjects', async (req, res) => {
  try {
    const enrolled = await prisma.studentSubject.findMany({
      where: { studentId: req.user.studentId },
      include: { subject: true }
    });
    res.json(enrolled.map(e => e.subject));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled subjects' });
  }
});

router.get('/subjects/available', async (req, res) => {
  try {
    // Get all subjects
    const allSubjects = await prisma.subject.findMany();
    
    // Get enrolled subjects
    const enrolled = await prisma.studentSubject.findMany({
      where: { studentId: req.user.studentId }
    });
    const enrolledIds = enrolled.map(e => e.subjectId);
    
    // Filter available subjects
    const available = allSubjects.filter(sub => !enrolledIds.includes(sub.id));
    res.json(available);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available subjects' });
  }
});

router.post('/subjects/enroll', async (req, res) => {
  const { subjectId } = req.body;
  try {
    const enrollment = await prisma.studentSubject.create({
      data: {
        studentId: req.user.studentId,
        subjectId: parseInt(subjectId)
      }
    });
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Already enrolled in this subject' });
    }
    res.status(500).json({ error: 'Failed to enroll in subject' });
  }
});

module.exports = router;
