# CareerNest Backend

MERN Stack backend for CareerNest - Internship and Job Portal.

## Prerequisites

- Node.js
- MongoDB (running locally or cloud URI)

## Setup

1.  Navigate to `backend` folder:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create `.env` file (Optional, defaults provided):
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/careernest
    JWT_SECRET=your_secret_key
    ```

4.  Run the server:
    ```bash
    npm run dev
    ```

## API Routes

### Auth
- `POST /api/auth/register` - Register user (role: 'student' or 'recruiter')
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

### Jobs
- `GET /api/jobs` - Get all jobs (query: keyword, location, type)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Recruiter/Admin)
- `PUT /api/jobs/:id` - Update job (Recruiter/Admin)
- `DELETE /api/jobs/:id` - Delete job (Recruiter/Admin)

### Profile
- `GET /api/profile/me` - Get data of logged in user's profile
- `POST /api/profile` - Create/Update profile
- `POST /api/profile/resume` - Upload resume (File key: `resume`)

### Applications
- `POST /api/applications/:jobId` - Apply for a job (Student)
- `GET /api/applications/my` - Get my applications (Student)
- `GET /api/applications/job/:jobId` - Get applications for a job (Recruiter)
- `PUT /api/applications/:id` - Update application status (Recruiter)

## Folder Structure

- `src/controllers`: Request logic
- `src/models`: Database schemas
- `src/routes`: API route definitions
- `src/middlewares`: Auth and Upload middleware
- `src/config`: Database configuration
