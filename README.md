# 📝 Feedback System

A full-stack internal feedback application that allows **managers** to assign employees, submit feedback, and track acknowledgment. **Employees** can view and acknowledge feedback, making the communication loop smooth and trackable.

---

## 🔧 Tech Stack

### 🚀 Frontend
- **React** (Vite)
- **React Router** – Client-side routing
- **CSS** – Utility-first styling
- **Axios** – HTTP client for API communication

### ⚙️ Backend
- **FastAPI** – Python web framework
- **SQLAlchemy** – ORM for database management
- **SQLite** – Default database (easy to switch to PostgreSQL)
- **PostgreSQL** – Hosted database for real time updates
- **JWT** – Authentication and role management

---

## ✨ Features

### 🔐 Authentication
- Role-based (Manager / Employee)
- Secure JWT-based login
- Simple registration interface

### 🧑‍💼 Manager Dashboard
- Left panel: List of assigned employees (sorted by most recent feedback)
- Right panel: Feedback thread for selected employee
- WhatsApp-style layout
- Features:
  - Add, update, delete feedback
  - Add employee (bottom-left)
  - Assign employee via modal (live list of unassigned users)
  - Feedback shows [Updated] tag if edited
  - Acknowledgment visual: ✅ Green (acknowledged), ❌ Red (not acknowledged)
  - Feedback form slides up on button click

### 👩‍💻 Employee Dashboard
- List of feedbacks (latest first)
- Acknowledge button for each feedback
- Counter for unacknowledged feedbacks
- Color indication for acknowledged/unacknowledged
- Clean, minimal interface

---

# ⚙️ Setup Instructions

## 1. Clone the Repository

```
https://github.com/shivam-sultania/Feedback-System.git
cd Feedback-system
code .
```


## 2. Enviroment Variables

### Create 📁 .env (Backend)

Copy code
```
SECRET_KEY = "DPDzero" # Add any secret key 
Authorized_URL = "http://localhost:5173"
```

### Create 📁 .env (Frontend)

Copy code
```
VITE_API_URL= "http://127.0.0.1:8000"
```

## 3. Backend Setup

### Create virtual environment
`python -m venv venv`

### Activate (Linux/Mac)
`source venv/bin/activate` 

### Activate (Windows)
`venv\Scripts\activate`

### Install dependencies
`pip install -r requirements.txt`

### Run FastAPI server
`python -m uvicorn main:app --reload`

Backend will run on: http://127.0.0.1:8000

- **Also hosted on Render** - https://feedback-system-g14d.onrender.com

### 4. Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

- **Also hosted on Render** - https://feedback-system-app.onrender.com

### Design Decisions :- 

- Modular Separation: Auth, dashboard, feedback, and API services are modularized for clarity and scalability.
- Client-side Routing: Role-based redirection handled via React Router.
- UI/UX Simplicity: Focused on ease-of-use with clean layout and functional design.
- Live updates: Assign employee modal updates the list dynamically.
- Responsive Layouts: Styled with Tailwind CSS for responsive, mobile-friendly views.
- Secure Auth Flow: JWT token stored in localStorage and protected routes based on role.



