# 🧠 Snazo – Collaborative Workflow Management System

Snazo is a **MERN Stack** (MongoDB, Express.js, React, Node.js) based collaborative project and task management platform. Built with role-based access, it empowers teams to efficiently manage projects and tasks in real-time with a modern and responsive UI.

---

## 📌 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Seeding the Database](#seeding-the-database)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contribution](#contribution)
- [License](#license)

---

## ⚙️ Tech Stack

- **Frontend**: React.js, Tailwind CSS / Material UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT-based with role-based access control
- **Optional**: WebSocket (for real-time updates), Vercel/Render for deployment

---

## ✅ Features

### 👥 Authentication & Authorization

- Login & Signup with JWT
- Roles: Admin (full access), User (task-specific access)
- Role-based route & component protection

### 📁 Project Management

- CRUD: Create, Read, Update, Delete projects
- Fields: `name`, `description`, `startDate`, `dueDate`, `status`, `teamMembers`
- Filter projects by `status` or `assigned team member`

### 📝 Task Management

- CRUD tasks under projects
- Fields: `title`, `description`, `assignedUser`, `priority`, `status`, `dueDate`
- Filter tasks by project

### 📊 Dashboard

- Task & project summary by status
- Deadlines in the next 7 days
- Drag-and-drop task status changes

### 🌐 Frontend (React)

- Authentication UI
- Project and Task views
- Responsive UI for mobile/desktop
- Clean, intuitive design with Tailwind CSS or Material UI

---

## 💡 Full Overview

We’ll build a **fully responsive Task Manager App** using the **MERN (MongoDB, Express, React, Node.js)** stack!

This app allows users to manage tasks efficiently with an intuitive interface, create, update, and track tasks with due dates and priorities, automated status updates, and assign tasks to multiple users and track completion.

### 🔧 Functionalities Implemented

1. **User Dashboard** – View assigned tasks, track progress, and get task insights.
2. **Task Management** – Create, update, and track tasks with due dates and priorities.
3. **Automated Status Updates** – Task status changes automatically based on the checklist.
4. **Team Collaboration** – Assign tasks to multiple users and track completion.
5. **Priority & Progress Tracking** – Categorize tasks by priority and monitor completion levels.
6. **Task Report Downloads** – Export task data for analysis and tracking.
7. **Attachments Support** – Add and access task-related file links easily.
8. **Mobile Responsive UI** – Seamless experience on desktop, tablet, and mobile.

---

## 🖼️ Screenshots

> _(Add screenshots of dashboard, login screen, project list, etc.)_

---

## 🚀 Getting Started

### 📥 Clone the repository

```bash
git clone https://github.com/basushawan/snazo.git
cd snazo
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Run the backend:

```bash
npm run dev
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🗂️ Folder Structure

```
snazo/
├── frontend/         # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── ...
├── backend/         # Node.js + Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── config/
└── README.md
```

---

## 🌱 Seeding the Database

You can use a `seed.js` script to populate test users, projects, and tasks:

```bash
node seed.js
```

Or use Postman to manually create users, login, then create projects/tasks.

---

## 📮 API Documentation

Use the provided **Postman Collection**: `snazo_api.postman_collection.json`

| Endpoint             | Method | Access        | Description                 |
| -------------------- | ------ | ------------- | --------------------------- |
| `/api/auth/register` | POST   | Public        | Register a new user         |
| `/api/auth/login`    | POST   | Public        | Login user, returns JWT     |
| `/api/projects`      | GET    | Admin/User    | Get all projects            |
| `/api/projects/:id`  | PUT    | Admin         | Update a project            |
| `/api/tasks`         | POST   | Admin/User    | Create task under a project |
| `/api/tasks/:id`     | DELETE | Assigned User | Delete a task               |

---

## 🌍 Deployment

### Frontend:

- Deploy on **Vercel** or **Netlify**

```bash
# Example Vercel CLI deployment
vercel --prod
```

### Backend:

- Deploy on **Render**, **Railway**, or **Heroku**

Make sure to:

- Set environment variables in the platform's dashboard
- Enable CORS correctly
- Point frontend requests to deployed backend URL

---

## 🤝 Contribution

Contributions are welcome!

1. Fork the repo
2. Create a branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push (`git push origin feature-name`)
5. Create a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

For questions, issues, or feedback:

- GitHub: [basushawan](https://github.com/basushawan)
- Email: connectshawan@gmail.com
