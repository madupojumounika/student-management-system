<div align="center">
  <h1 align="center">Smart Student Management System</h1>
  <p align="center">
    A production-ready, full-stack platform for managing academic records, attendance, and student performance.
    <br />
    <br />
    <a href="#features">Features</a>
    ·
    <a href="#tech-stack">Tech Stack</a>
    ·
    <a href="#getting-started">Getting Started</a>
    ·
    <a href="#default-credentials">Default Credentials</a>
  </p>
</div>

---

## ✨ Features

- 🔐 **JWT Authentication & Authorization**: Highly secure login with protected routes.
- 👥 **Role-Based Access Control (RBAC)**: Distinct dashboards and tailored permissions for Admin, Teacher, and Student roles.
- 🗄️ **Robust Database Design**: Fully normalized PostgreSQL schema modeling complex academic relationships.
- 🛡️ **Type-Safe ORM**: Powered by Prisma ORM for seamless database migrations and strongly-typed queries.
- 📅 **Smart Attendance Tracking**: Mark, view, and calculate attendance percentages automatically.
- 📊 **Performance Analytics**: Track external marks, internal marks, and grades with real-time visual charts and statistics.
- 🎨 **Modern Responsive UI**: Built with Tailwind CSS, ensuring a beautiful, glass-morphism aesthetic that works seamlessly across all devices.

<br />

## 💻 Tech Stack

**Frontend Environment:**
- **React 19** & **Vite** - Extremely fast development and build times.
- **Tailwind CSS 4** - Utility-first styling for a beautiful, custom UI.
- **React Router v7** - Declarative routing and protected routes.
- **Recharts** - Dynamic data visualization for student analytics.
- **Axios** - Promise-based HTTP client.

**Backend Environment:**
- **Node.js** & **Express.js** - Robust RESTful API architecture.
- **Prisma ORM** - Next-generation Node.js and TypeScript ORM.
- **PostgreSQL** - Powerful, open source object-relational database system.
- **JWT & bcrypt** - Industry-standard security and password hashing.

<br />

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or a remote URI)

### 1. Clone the Repository

```bash
git clone https://github.com/madupojumounika/student-management-system.git
cd student-management-system
```

### 2. Install Dependencies

The project uses a root `package.json` to manage both the client and server concurrently. Run this single command from the root folder:

```bash
npm run install:all
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory (`server/.env`) and add your PostgreSQL connection string:

```env
# server/.env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/student_management?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```

### 4. Database Setup & Migration

Navigate to the server folder and run the Prisma migrations to set up your tables, then seed the database with initial default data:

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
node prisma/seed.js
```

### 5. Run the Application

Navigate back to the root directory and start both the backend and frontend simultaneously:

```bash
cd ..
npm start
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

<br />

## 🔑 Default Credentials

If you ran the `prisma/seed.js` script in the setup phase, the following default accounts are available for testing:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Teacher** | `johndoe` | `teacher123` |
| **Student** | `alicesmith` | `student123` |

<br />

## 📂 Project Structure

```text
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components & layouts
│   │   ├── context/        # React Context (Auth State)
│   │   ├── pages/          # Role-based Pages (Admin, Teacher, Student)
│   │   └── index.css       # Tailwind entry and global styles
├── server/                 # Backend Node/Express API
│   ├── prisma/             # Schema definitions and seeding logic
│   ├── src/
│   │   ├── middlewares/    # Auth and Role verification
│   │   ├── routes/         # Express API routes
│   │   └── utils/          # Prisma client and helpers
├── package.json            # Root configuration for concurrently
└── README.md               # Project documentation
```

---
<div align="center">
  <i>Built with ❤️ for modern education management.</i>
</div>
