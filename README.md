# AI Mock Interview Platform

> A polished AI-powered mock interview application built as a full-stack project with React/Vite frontend and Node/Express backend.

This project simulates an interview experience by generating dynamic AI interview questions, accepting user responses through text, audio, or code, and returning evaluation and feedback. It is designed for realistic mock interviews while keeping resource usage manageable.

---

## 🌟 Project Overview

The AI Mock Interview Platform offers:
- Role-based interviews for developer and analyst positions
- Difficulty selection with tailored question sets
- Resume upload to personalize interview prompts
- Real-time interview flow with AI-generated interviewer messages
- Audio-based answer transcription and text-based response handling
- Code submission evaluation for technical questions
- Feedback reporting and interview history tracking
- A device-level limit of 2 interview attempts to reduce backend cost and storage

This repository is split into two main parts:

- `client/` — React frontend built with Vite
- `server/` — Express backend with MongoDB and AI service integration

---

## 🚀 Key Features

- **AI question generation** based on selected role and resume content
- **Voice-enabled interviewing** with Murf-generated speech
- **Resume upload** via PDF and OCR parsing
- **Session persistence** through backend interview storage and history
- **Interview scoring** with AI-generated feedback
- **Device-specific attempt limit** using browser `localStorage`
- **Authentication support** for secure API access

---

## 🧭 Architecture

### Frontend (`client/`)

Built with React and Vite, the frontend handles:
- interview setup and role/difficulty selection
- resume upload interface
- interview screens and answer submission
- feedback display and history navigation
- API communication with backend via Axios

Important files:
- `client/src/pages/InterviewSetupPage/index.jsx`
- `client/src/pages/InterviewPage/index.jsx`
- `client/src/pages/FeedbackPage/index.jsx`
- `client/src/services/api.js`
- `client/src/services/interviewService.js`

### Backend (`server/`)

Built with Node.js, Express, and MongoDB. The backend handles:
- user authentication and JWT protection
- interview creation, progress tracking, and completion
- AI calls to Gemini, AssemblyAI, Murf
- resume upload and parsing
- interview history storage

Important files:
- `server/server.js`
- `server/src/app.js`
- `server/src/routes/interview.routes.js`
- `server/src/controllers/interview.controller.js`
- `server/src/services/interview.service.js`
- `server/src/models/Interview.model.js`

---

## 🛠️ Tech Stack

- Frontend: React, Vite, React Router, Axios, React Hot Toast
- Backend: Node.js, Express, Mongoose, MongoDB
- Authentication: JWT
- AI/Voice services:
  - Google Gemini
  - AssemblyAI
  - Murf
- Resume parsing: `pdfjs-dist`

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd "AI Mock Interview Platform"
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

---

## ▶️ Run Locally

### Start the backend

```bash
cd server
npm start
```

### Start the frontend

```bash
cd client
npm run dev
```

Default local endpoints:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## 🔧 Environment Variables

Create a `.env` file inside `server/` with:

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
GEMINI_API_KEY=<your-gemini-api-key>
ASSEMBLYAI_API_KEY=<your-assemblyai-api-key>
MURF_API_KEY=<your-murf-api-key>
CLIENT_URL=http://localhost:5173
```

For production frontend, add `VITE_API_URL` to your frontend deployment environment:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 🧪 Interview Attempt Limits

This app enforces a **device-specific limit of 2 interview attempts** using browser `localStorage`.

- The limit is tracked by the key: `deviceInterviewAttempts`
- It is enforced in:
  - `client/src/pages/InterviewSetupPage/index.jsx`
  - `client/src/pages/FeedbackPage/index.jsx`
- This means the limit is tied to the browser/device, not the account.

---

## 📁 Folder Structure

```
AI Mock Interview Platform/
├─ client/          # React frontend
│  ├─ public/
│  ├─ src/
│  ├─ package.json
│  └─ ...
├─ server/          # Express backend
│  ├─ src/
│  ├─ package.json
│  └─ server.js
└─ README.md        # Project documentation
```

---

## 💡 Tips for Interview Demo

- Upload a PDF resume before starting.
- Select a role and difficulty level.
- Answer interviewer questions via text or audio.
- Use the feedback screen to review strengths and weaknesses.
- Remember: only 2 interview attempts are allowed per device.

---

## 📚 Notes

- For full production readiness, ensure proper API key and secret management.
- The backend uses AI services, so API usage may incur cost.
- The app is perfect for a small portfolio demo or lightweight mock interview tool.

---

## 🙌 Thanks

This project is built to demonstrate a complete full-stack AI interview experience with a strong emphasis on usability, guided interview flow, and cost-aware behavior.
