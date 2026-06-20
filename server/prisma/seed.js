require('dotenv').config();
const prisma = require('../src/utils/prisma');
const bcrypt = require('bcrypt');

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data (optional, but good for resetting)
  await prisma.mark.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.studentSubject.deleteMany();
  await prisma.teacherSubject.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data.');

  // 2. Create Departments
  const cse = await prisma.department.create({
    data: { department_name: 'Computer Science and Engineering' }
  });
  const ece = await prisma.department.create({
    data: { department_name: 'Electronics and Communication' }
  });

  // 3. Create Subjects
  const sub1 = await prisma.subject.create({
    data: { subject_code: 'CS101', subject_name: 'Introduction to Programming', semester: 1, credits: 4 }
  });
  const sub2 = await prisma.subject.create({
    data: { subject_code: 'CS102', subject_name: 'Data Structures', semester: 2, credits: 4 }
  });

  // 4. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@college.edu',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // 5. Create Teacher User
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const teacherUser = await prisma.user.create({
    data: {
      username: 'johndoe',
      email: 'johndoe@college.edu',
      password: teacherPassword,
      role: 'TEACHER',
      teacher: {
        create: {
          teacher_id: 'T001',
          departmentId: cse.id,
          qualification: 'Ph.D. in Computer Science'
        }
      }
    },
    include: { teacher: true }
  });

  // Assign Subject to Teacher
  await prisma.teacherSubject.create({
    data: {
      teacherId: teacherUser.teacher.id,
      subjectId: sub1.id
    }
  });

  // 6. Create Student User
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentUser = await prisma.user.create({
    data: {
      username: 'alicesmith',
      email: 'alice@student.college.edu',
      password: studentPassword,
      role: 'STUDENT',
      student: {
        create: {
          student_id: 'S001',
          departmentId: cse.id,
          semester: 1,
          section: 'A',
          phone: '1234567890',
          address: '123 College St'
        }
      }
    },
    include: { student: true }
  });

  // Assign Subject to Student
  await prisma.studentSubject.create({
    data: {
      studentId: studentUser.student.id,
      subjectId: sub1.id
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
