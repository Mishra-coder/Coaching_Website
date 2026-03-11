# Success Mantra Institute

A complete web platform for coaching institute management built with React and Node.js. This application handles everything from student enrollment to video lectures, quizzes, and contests.

## Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend (React + Vite)"]
        UI[User Interface]
        Auth[Authentication]
        Router[React Router]
        API_Client[API Client - Axios]
    end
    
    subgraph Backend["Backend (Node.js + Express)"]
        API[REST API]
        AuthMW[Auth Middleware]
        Routes[Route Handlers]
        Controllers[Business Logic]
    end
    
    subgraph Database["Database (MongoDB)"]
        Users[(Users)]
        Courses[(Courses)]
        Videos[(Videos)]
        Questions[(Questions)]
        QuizResults[(Quiz Results)]
        Contests[(Contests)]
        ContestResults[(Contest Results)]
        Enrollments[(Enrollments)]
        DemoBookings[(Demo Bookings)]
    end
    
    subgraph External["External Services"]
        Cloudinary[Cloudinary - Video Storage]
        Gmail[Gmail - Email Service]
        GoogleSheets[Google Sheets - Backup]
        GoogleOAuth[Google OAuth]
    end
    
    UI --> Router
    Router --> Auth
    Auth --> API_Client
    API_Client -->|HTTP/REST| API
    
    API --> AuthMW
    AuthMW --> Routes
    Routes --> Controllers
    
    Controllers --> Users
    Controllers --> Courses
    Controllers --> Videos
    Controllers --> Questions
    Controllers --> QuizResults
    Controllers --> Contests
    Controllers --> ContestResults
    Controllers --> Enrollments
    Controllers --> DemoBookings
    
    Controllers -->|Upload Videos| Cloudinary
    Controllers -->|Send Emails| Gmail
    Controllers -->|Backup Data| GoogleSheets
    Auth -->|OAuth Login| GoogleOAuth
    
    style Frontend fill:#e1f5ff
    style Backend fill:#fff4e1
    style Database fill:#e8f5e9
    style External fill:#fce4ec
```

## Database Schema

```mermaid
erDiagram
    Users ||--o{ QuizResults : takes
    Users ||--o{ ContestResults : participates
    Users ||--o{ Enrollments : submits
    Users ||--o{ DemoBookings : books
    Users ||--o{ Videos : uploads
    
    Courses ||--o{ Videos : contains
    Courses ||--o{ Enrollments : enrolls_in
    
    Contests ||--o{ ContestResults : has
    
    Users {
        ObjectId _id PK
        String name
        String email UK
        String password
        String role
        String phone
        String address
        Number xp
        DateTime createdAt
        DateTime updatedAt
    }
    
    Courses {
        ObjectId _id PK
        String title UK
        String description
        String category
        Number price
        String duration
        String level
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }
    
    Videos {
        ObjectId _id PK
        String title
        String description
        String cloudinaryId
        String videoUrl
        String hlsUrl
        String thumbnail
        Number duration
        ObjectId courseId FK
        String class
        String chapter
        ObjectId uploadedBy FK
        Number views
        String status
        DateTime createdAt
        DateTime updatedAt
    }
    
    Questions {
        ObjectId _id PK
        String question
        Array options
        String correctAnswer
        String class
        String chapter
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }
    
    QuizResults {
        ObjectId _id PK
        ObjectId userId FK
        String class
        String chapter
        Number score
        Number totalQuestions
        Number xpEarned
        Array answers
        DateTime createdAt
        DateTime updatedAt
    }
    
    Contests {
        ObjectId _id PK
        String title UK
        String description
        Array questions
        DateTime startTime
        Number duration
        DateTime endTime
        String status
        DateTime createdAt
        DateTime updatedAt
    }
    
    ContestResults {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId contestId FK
        Number score
        Number totalQuestions
        Number timeTaken
        Array answers
        Number rank
        DateTime submittedAt
        DateTime createdAt
        DateTime updatedAt
    }
    
    Enrollments {
        ObjectId _id PK
        String studentName
        String fatherName
        String motherName
        Date dateOfBirth
        String gender
        String aadharNumber UK
        String mobileNumber
        String address
        String class
        String board
        String competitiveCourse
        String status
        String adminRemarks
        ObjectId userId FK
        DateTime createdAt
        DateTime updatedAt
    }
    
    DemoBookings {
        ObjectId _id PK
        String studentName
        String parentName
        String mobileNumber
        String email
        String class
        String subject
        Date preferredDate
        String preferredTime
        String status
        String adminRemarks
        ObjectId userId FK
        DateTime createdAt
        DateTime updatedAt
    }
```

## What This Project Does

This is a full-featured coaching institute website where students can enroll in courses, watch video lectures, take quizzes, and participate in contests. Admins can manage everything through a dedicated dashboard.

## Main Features

### For Students
- Create account with email or Google
- Browse available courses
- Watch video lectures (stored on Cloudinary)
- Take chapter-wise quizzes and earn XP
- Participate in timed contests
- View leaderboards and rankings
- Track progress and quiz history
- Book free demo classes
- Submit enrollment forms

### For Admins
- Manage student enrollments
- Upload and organize video lectures
- Create quizzes with bulk upload (Excel/CSV)
- Schedule and manage contests
- Review demo booking requests
- Update enrollment status with remarks
- View statistics and analytics
- Automatic data backup to Google Sheets

## Technology Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Context API for state management
- CSS3 for styling

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Cloudinary for video storage
- Nodemailer for emails
- Google Sheets API for data backup
- Multer for file uploads

## Getting Started

### What You Need
- Node.js (version 16 or higher)
- MongoDB (running locally or cloud)
- Cloudinary account (for videos)
- Gmail account (for sending emails)
- Google Cloud account (optional, for Sheets integration)

### Installation Steps

1. Clone this repository
```bash
git clone https://github.com/Mishra-coder/Coaching_Website.git
cd Coaching_Website
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Setup backend environment variables

Create `backend/.env` file:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/success-mantra
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000

EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
ADMIN_EMAIL=admin-email@gmail.com

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

5. Setup frontend environment variables

Create `frontend/.env.local` file:
```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

6. Start the backend server
```bash
cd backend
npm run dev
```

7. Start the frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:3000`

## Project Structure

```
Coaching_Website/
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Admin/       # Admin dashboard components
│   │   │   ├── About.jsx
│   │   │   ├── AdmissionForm.jsx
│   │   │   ├── Contests.jsx
│   │   │   ├── DemoBooking.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── Videos.jsx
│   │   ├── context/         # React Context
│   │   ├── services/        # API service layer
│   │   ├── assets/          # Images and icons
│   │   ├── App.jsx          # Main app component
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/              # Configuration files
│   │   ├── cloudinary.js    # Cloudinary setup
│   │   ├── db.js            # MongoDB connection
│   │   └── googleAuth.js    # Google OAuth setup
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # JWT authentication
│   ├── models/              # MongoDB schemas
│   │   ├── Contest.js
│   │   ├── ContestResult.js
│   │   ├── Course.js
│   │   ├── DemoBooking.js
│   │   ├── Enrollment.js
│   │   ├── Question.js
│   │   ├── QuizResult.js
│   │   ├── User.js
│   │   └── Video.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── contestRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── demoBookingRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── quizRoutes.js
│   │   └── videoRoutes.js
│   ├── utils/               # Utility functions
│   │   ├── email.js         # Email notifications
│   │   ├── emailResubmit.js # Resubmission emails
│   │   └── googleSheets.js  # Google Sheets integration
│   ├── uploads/             # Temporary file storage
│   ├── server.js            # Express server
│   └── package.json
│
├── .gitignore
└── README.md
```

## How to Use

### Admin Access
To access admin features, use the secret key `admin123` when signing up or logging in.

### Uploading Videos
1. Login as admin
2. Go to Admin Dashboard → Video Manager
3. Click "Upload Video"
4. Select video file, add title and description
5. Video will be uploaded to Cloudinary automatically

### Creating Quizzes
1. Go to Admin Dashboard → Question Manager
2. Either add questions manually or bulk upload via Excel/CSV
3. Questions will be available for students immediately

### Managing Contests
1. Go to Admin Dashboard → Contest Manager
2. Create contest with title, duration, and start time
3. Add questions manually or bulk upload
4. Students can participate during the contest window

## Cloudinary Setup

1. Create account at https://cloudinary.com
2. Get your credentials from dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to `backend/.env`
4. Videos will automatically upload to cloud storage

## Google Sheets Integration (Optional)

This feature automatically backs up user signups and enrollments to Google Sheets.

1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create a Service Account and download JSON key
4. Share your Google Sheet with the service account email
5. Add credentials to `backend/.env`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/admin-register` - Admin signup
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get single video
- `POST /api/videos/upload` - Upload video (admin)
- `DELETE /api/videos/:id` - Delete video (admin)

### Quizzes
- `GET /api/questions` - Get questions by class/chapter
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get user quiz history

### Contests
- `GET /api/contests` - Get all contests
- `GET /api/contests/active` - Get active contests
- `POST /api/contests/:id/submit` - Submit contest
- `GET /api/contests/:id/leaderboard` - Get rankings

### Enrollments
- `POST /api/enrollments` - Submit enrollment form
- `GET /api/enrollments` - Get all enrollments (admin)
- `PUT /api/enrollments/:id/status` - Update status (admin)

## Database Schema

### User
- name, email, password (hashed)
- role (student/admin)
- phone, address
- timestamps

### Video
- title, description
- cloudinaryId, videoUrl, hlsUrl
- thumbnail, duration
- uploadedBy, views, status

### Question
- question, options (array)
- correctAnswer
- class, chapter
- isActive

### Contest
- title, description
- questions (array)
- startTime, duration, endTime
- status

### Enrollment
- studentName, fatherName, motherName
- dateOfBirth, gender, aadharNumber
- mobileNumber, address
- class, board, competitiveCourse
- status, adminRemarks

## Environment Variables

### Backend Required
- `PORT` - Server port (default: 5001)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS
- `EMAIL_USER` - Gmail for sending emails
- `EMAIL_PASSWORD` - Gmail app password
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend Required
- `VITE_API_URL` - Backend API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

## Development

### Backend Development
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5001

### Frontend Development
```bash
cd frontend
npm run dev
```
App runs on http://localhost:3000

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend is production-ready as-is.

## Common Issues

### Videos not uploading
- Check Cloudinary credentials in `.env`
- Verify file size is under 500MB
- Check internet connection

### Emails not sending
- Use Gmail app password, not regular password
- Enable "Less secure app access" in Gmail settings
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`

### MongoDB connection failed
- Make sure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify database name is correct

## Contributing

Feel free to fork this project and submit pull requests. For major changes, please open an issue first.

## License

This project is for educational purposes.

## Author

Devendra Mishra  
GitHub: [@Mishra-coder](https://github.com/Mishra-coder)

---

Built with ❤️ for Success Mantra Institute
