# Success Mantra Institute - Coaching Website

A modern full-stack web application for coaching institute management with video lectures, quizzes, contests, and admin panel.

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0.3-brightgreen?logo=mongodb)
![License](https://img.shields.io/badge/License-Educational-blue)

## What's Inside

### For Students
- Secure login with email or Google account
- Browse and enroll in courses
- Watch video lectures with HLS streaming
- Take chapter-wise quizzes
- Participate in timed contests
- Track your progress and XP points
- Book free demo classes

### For Admins
- Manage students and enrollments
- Upload and manage video lectures
- Create quizzes and contests
- Review demo booking requests
- Send email notifications
- Export data to Google Sheets

## Tech Stack

**Frontend:** React, Vite, React Router, Axios  
**Backend:** Node.js, Express, MongoDB, JWT  
**Storage:** Cloudinary (videos & images)  
**Features:** Video streaming, Email (Nodemailer), Google OAuth, Google Sheets

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB
- Gmail account (for emails)
- Cloudinary account (for video/image storage)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Mishra-coder/Coaching_Website.git
cd Coaching_Website
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

3. Setup environment variables

Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/success-mantra
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

4. Run the application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:5001

## Admin Access

Use secret key `admin123` when signing up or logging in as admin.

## Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```
4. Videos will automatically upload to Cloudinary with:
   - Automatic HLS streaming
   - Thumbnail generation
   - CDN delivery

## Google Sheets Integration (Optional)

1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create a Service Account and download JSON key
4. Share your Google Sheet with the service account email
5. Add to `backend/.env`:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
```

## Key Features Explained

### Video Lectures
- Upload videos through admin panel
- Automatic Cloudinary upload with HLS streaming
- Thumbnail generation
- View count tracking
- CDN-powered delivery

### Quiz System
- Chapter-wise questions for Class 10 & 12
- Instant results with XP rewards
- Quiz history tracking
- Bulk question upload via Excel/CSV

### Contest System
- Timed contests with leaderboards
- XP-based ranking
- Automatic result calculation
- Contest history

### Email Notifications
- Welcome emails on signup
- Enrollment status updates
- Demo booking confirmations

## Project Structure

```
Coaching_Website/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Auth context
│   │   ├── services/        # API calls
│   │   └── index.css        # Styles
│   └── package.json
│
├── backend/
│   ├── config/              # Database & OAuth config
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── utils/               # Email, video processing
│   ├── uploads/             # Video files
│   └── server.js
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth login

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos/upload` - Upload video (admin)
- `DELETE /api/videos/:id` - Delete video (admin)

### Quizzes
- `GET /api/quiz/questions` - Get questions
- `POST /api/quiz/submit` - Submit quiz

### Contests
- `GET /api/contests` - Get contests
- `POST /api/contests/:id/submit` - Submit contest

### Enrollments
- `POST /api/enrollments` - Submit enrollment
- `PUT /api/enrollments/:id/status` - Update status (admin)

## Security

- Password hashing with bcrypt
- JWT authentication
- Protected admin routes
- Secure file uploads
- Input validation

## Browser Support

Works on all modern browsers including Chrome, Firefox, Safari, Edge, and mobile browsers.

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

Educational purposes only.

## Author

**Devendra Mishra**  
GitHub: [@Mishra-coder](https://github.com/Mishra-coder)

---

Made with ❤️ for Success Mantra Institute
