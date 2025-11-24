# Success Mantra Institute - Full-Stack Coaching WebSite

A modern, full-stack web application for Success Mantra coaching institute featuring student enrollment, quiz system, course management, and a beautiful responsive UI.

![Success Mantra](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## � About The Project

Success Mantra Institute is a comprehensive coaching platform designed for Class 10th and 12th students. The platform provides:
- **Interactive Quiz System** with board-level mathematics questions
- **Online Enrollment** with photo upload capability
- **Course Management** for Foundation, Board, and Competitive exam preparation
- **User Authentication** with JWT-based security
- **Responsive Design** optimized for all devices (mobile, tablet, desktop)

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **React Router DOM** | 7.9.6 | Client-side routing |
| **Vite** | 4.4.5 | Build tool & dev server |
| **Axios** | 1.6.2 | HTTP client for API calls |
| **FontAwesome** | 6.4.0 | Icons library |
| **Context API** | Built-in | State management |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | Runtime environment |
| **Express** | 4.18.2 | Web framework |
| **MongoDB** | - | NoSQL database |
| **Mongoose** | 8.0.3 | MongoDB ODM |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Multer** | 1.4.5 | File upload handling |
| **CORS** | 2.8.5 | Cross-origin requests |
| **Nodemon** | 3.0.2 | Development auto-reload |

### Styling
- **Custom CSS** with modern design patterns
- **Glassmorphism** effects
- **Gradient backgrounds**
- **Smooth animations** and transitions
- **Google Fonts** (Outfit family)

## 🚀 Features

### ✨ Core Features
- 🔐 **User Authentication** - Secure JWT-based login/registration & Google OAuth
- 📚 **Course Catalog** - Foundation, Board, and Competitive exam courses
- 📝 **Online Enrollment** - Digital admission form with photo upload
- 🎯 **Quiz System** - Chapter-wise practice questions for Class 10 & 12
- 📊 **XP System** - Gamified learning with experience points
- 👤 **User Profile** - Personal dashboard with enrollment history
- 📱 **Fully Responsive** - Works seamlessly on all devices

### 🎨 UI/UX Features
- Modern vibrant color scheme (Indigo & Amber)
- Smooth page transitions and animations
- Touch-optimized for mobile devices
- Glassmorphism card designs
- Interactive hover effects
- Mobile-first responsive design

### 🧮 Quiz Features
- Class 10 & 12 Mathematics questions
- Chapter-wise organization
- Real-time score calculation
- Answer review with explanations
- XP rewards for completion
- Progress tracking

## 📁 Project Structure

```
success-mantra-react/
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ...
│   │   ├── context/          # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── data/             # Static data
│   │   │   └── quizData.js
│   │   ├── assets/           # Images, logos
│   │   ├── index.css         # Global styles
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Course.js         # Course schema
│   │   ├── Enrollment.js     # Enrollment schema
│   │   └── QuizResult.js     # Quiz result schema
│   ├── routes/
│   │   ├── authRoutes.js     # Auth endpoints
│   │   ├── courseRoutes.js   # Course endpoints
│   │   ├── enrollmentRoutes.js
│   │   └── quizRoutes.js     # Quiz endpoints
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── scripts/
│   │   └── seedCourses.js    # Database seeding
│   ├── server.js             # Express server
│   ├── .env                  # Environment variables
│   └── package.json
│
├── start-backend.sh          # Backend startup script
├── start-frontend.sh         # Frontend startup script
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd success-mantra-react
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

### 3. Configure Environment Variables

Create `backend/.env` file:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/success-mantra

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

### 4. Setup Database

**Option A: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

**Option B: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 5. Seed Database with Sample Courses
```bash
cd backend
npm run seed
```

## 🚀 Running the Application

### Using Startup Scripts (Recommended)

**Terminal 1 - Backend:**
```bash
./start-backend.sh
```
Backend runs on: `http://localhost:5001`

**Terminal 2 - Frontend:**
```bash
./start-frontend.sh
```
Frontend runs on: `http://localhost:5173`

### Manual Start

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🔑 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |
| PUT | `/profile` | Update profile | Yes |

### Courses (`/api/courses`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all courses | No |
| GET | `/:id` | Get single course | No |

### Enrollments (`/api/enrollments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create enrollment | Yes |
| GET | `/user/:userId` | Get user enrollments | Yes |
| GET | `/:id` | Get single enrollment | Yes |

### Quiz (`/api/quiz`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/submit` | Submit quiz result | Yes |
| GET | `/history` | Get quiz history | Yes |

## 📱 Key Components

### Frontend Components
- **Navbar** - Navigation with XP display
- **Hero** - Landing page hero section
- **Quiz** - Interactive quiz system
- **Profile** - User dashboard
- **Enrollment** - Admission form
- **Courses** - Course catalog
- **Faculty** - Faculty information
- **About** - About page
- **Footer** - Site footer

### Backend Models
- **User** - User authentication & profile
- **Course** - Course information
- **Enrollment** - Student enrollments
- **QuizResult** - Quiz scores & history

## 🎯 Usage Guide

### For Students
1. **Register** - Create an account
2. **Browse Courses** - Explore available courses
3. **Enroll** - Fill admission form with photo
4. **Take Quizzes** - Practice chapter-wise questions
5. **Track Progress** - View XP and quiz history in profile

### For Administrators
- Access enrollment data via API
- View all student enrollments
- Monitor quiz performance

## 🔒 Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes and API endpoints
- CORS configuration
- Input validation
- Secure file upload handling

## 📊 Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (student/admin),
  enrollments: [ObjectId],
  createdAt: Date
}
```

### Enrollment Collection
```javascript
{
  user: ObjectId,
  course: ObjectId,
  studentName: String,
  fatherName: String,
  motherName: String,
  dateOfBirth: { day, month, year },
  gender: String,
  address: String,
  aadharNumber: String,
  mobileNumber: String,
  photo: String (base64),
  status: String,
  enrollmentDate: Date
}
```

## 🎨 Design System

### Colors
- **Primary**: Vibrant Indigo (#4f46e5)
- **Secondary**: Amber/Gold (#f59e0b)
- **Accent**: Cyan (#06b6d4)
- **Background**: Slate (#f8fafc)

### Typography
- **Font Family**: Outfit (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

## 🤝 Contributing
This is an educational project. Feel free to fork and modify for learning purposes.

## 📝 License
Educational purposes only.

## 👨‍💻 Developer
Developed as a full-stack coaching platform project.

---

**Made with ❤️ for Success Mantra Institute**

**Happy Learning! 📚✨**
