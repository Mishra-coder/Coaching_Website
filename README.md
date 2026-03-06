# Success Mantra Institute - Coaching Website

A modern, full-stack web application for Success Mantra coaching institute featuring student enrollment, quiz system, contest management, and comprehensive admin panel.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## Features

### Student Features
- **User Authentication** - Secure signup and login with JWT
- **Course Catalog** - Browse Foundation, Board, and Competitive exam courses
- **Online Enrollment** - Digital admission form with photo upload
- **Interactive Quizzes** - Chapter-wise practice questions for Class 10 & 12
- **Contest System** - Participate in timed contests with XP rewards and leaderboards
- **Demo Booking** - Schedule free demo classes
- **User Profile** - Track enrollments, quiz history, and contest performance
- **Email Notifications** - Receive confirmation and status update emails

### Admin Features
- **Admin Dashboard** - Overview of all platform statistics
- **Student Management** - View and manage all registered students
- **Enrollment Management** - Review, approve, or reject admission forms with remarks
- **Question Bank** - Add, edit, and manage quiz questions (supports bulk CSV/Excel upload)
- **Contest Management** - Create and manage contests with bulk question upload
- **Demo Booking Management** - Handle demo class requests
- **Email System** - Automated notifications to students
- **Google Sheets Integration** - Automatic data backup (optional)

### Technical Features
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Real-time Updates** - Dynamic content loading
- **Secure Authentication** - Password hashing and JWT tokens
- **File Upload** - Photo upload for enrollments
- **Email Integration** - Gmail SMTP for notifications
- **Data Backup** - Optional Google Sheets auto-sync

## Tech Stack

### Frontend
- React 18.2.0
- React Router DOM 7.9.6
- Vite 4.4.5
- Axios 1.6.2
- FontAwesome 6.4.0
- Custom CSS with modern design

### Backend
- Node.js with Express 4.18.2
- MongoDB with Mongoose 8.0.3
- JWT 9.0.2 for authentication
- bcryptjs 2.4.3 for password hashing
- Nodemailer 8.0.1 for emails
- Multer for file uploads
- XLSX for Excel file processing
- Google Sheets API (optional)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email notifications)

### 1. Clone Repository
```bash
git clone <repository-url>
cd Coaching_Website
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Configuration

Create `backend/.env`:
```env
PORT=5001
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/success-mantra

JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=your_gmail@gmail.com

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Optional: Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SPREADSHEET_ID=
```

Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. Setup Gmail for Emails
1. Enable 2-Step Verification in Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-digit password in `EMAIL_PASSWORD`

### 5. Setup MongoDB
**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
1. Create account at mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env`

## Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## Default Admin Credentials

**Admin Secret Key:** `admin123`

Use this key when signing up or logging in as admin.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Student signup
- `POST /api/auth/admin-register` - Admin signup (requires secret key)
- `POST /api/auth/login` - Login (admin requires secret key)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course

### Enrollments
- `POST /api/enrollments` - Submit enrollment
- `GET /api/enrollments/user/:userId` - Get user enrollments
- `PUT /api/enrollments/:id/status` - Update enrollment status (admin)

### Quizzes
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz result
- `GET /api/quiz/history` - Get quiz history

### Contests
- `GET /api/contests` - Get all contests
- `POST /api/contests` - Create contest (admin)
- `POST /api/contests/:id/submit` - Submit contest
- `GET /api/contests/:id/leaderboard` - Get leaderboard

### Demo Bookings
- `POST /api/demo-bookings` - Book demo class
- `GET /api/demo-bookings` - Get all bookings (admin)

## Project Structure

```
Coaching_Website/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/          # Admin panel components
│   │   │   ├── SignUp.jsx      # Signup page
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Courses.jsx     # Course catalog
│   │   │   ├── Enrollment.jsx  # Admission form
│   │   │   ├── Quiz.jsx        # Quiz system
│   │   │   ├── ContestQuiz.jsx # Contest page
│   │   │   ├── Profile.jsx     # User profile
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication state
│   │   ├── services/
│   │   │   └── api.js          # API calls
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── googleAuth.js       # Google OAuth
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Question.js
│   │   ├── QuizResult.js
│   │   ├── Contest.js
│   │   ├── ContestResult.js
│   │   └── DemoBooking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── contestRoutes.js
│   │   └── demoBookingRoutes.js
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   ├── utils/
│   │   ├── email.js            # Email notifications
│   │   ├── emailResubmit.js    # Resubmit emails
│   │   └── googleSheets.js     # Google Sheets sync
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/admin),
  isVerified: Boolean,
  createdAt: Date
}
```

### Enrollment
```javascript
{
  user: ObjectId,
  studentName: String,
  fatherName: String,
  motherName: String,
  dateOfBirth: { day, month, year },
  gender: String,
  aadharNumber: String,
  mobileNumber: String,
  address: String,
  photo: String (base64),
  status: String (pending/active/cancelled),
  adminRemarks: String,
  createdAt: Date
}
```

### Contest
```javascript
{
  title: String,
  description: String,
  questions: [ObjectId],
FRONTEND_URL=http://localhost:3000
  startTime: Date,
  endTime: Date,
  isActive: Boolean,
  createdAt: Date
}
```

## Optional: Google Sheets Integration

Automatically backup user signups and enrollments to Google Sheets.

### Setup Steps:
1. Create Google Cloud project
2. Enable Google Sheets API
3. Create Service Account and download JSON key
4. Create Google Sheet with "Users" and "Enrollments" tabs
5. Share sheet with service account email
6. Add credentials to `.env` file

See `backend/GOOGLE_SHEETS_SETUP.md` for detailed instructions.

## Design System

### Colors
- Primary: Indigo (#4f46e5)
- Secondary: Amber (#f59e0b)
- Accent: Cyan (#06b6d4)
- Background: Slate (#f8fafc)

### Typography
- Font: Outfit (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- CORS configuration
- Input validation
- Secure file uploads
- Admin secret key protection

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License
Educational purposes only.

---

**Made with for Success Mantra Institute**
