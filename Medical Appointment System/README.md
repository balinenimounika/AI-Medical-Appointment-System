# AI Medical Appointment System

A production-ready, full-stack AI-powered hospital management and appointment booking platform with intelligent features including AI medical chatbot, smart scheduling, and comprehensive healthcare management.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Node](https://img.shields.io/badge/Node-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248)

## 🌟 Features

### Core Features
- **Multi-Role Authentication**: Secure JWT-based authentication for Patients, Doctors, and Admins
- **Role-Based Dashboards**: Specialized dashboards for each user role
- **Appointment Management**: Smart booking system with real-time availability
- **Prescription Management**: Digital prescriptions with PDF generation
- **Medical Reports**: Secure upload and management of medical documents
- **Real-time Notifications**: In-app notification system
- **Video Consultation**: Support for video consultations

### AI Features
- **AI Medical Chatbot**: Gradio-powered AI assistant with Gemini/OpenAI integration
- **Symptom Checker**: AI-powered symptom analysis and condition suggestions
- **Smart Doctor Recommendations**: AI suggests appropriate specialists
- **Voice Support**: Speech-to-text for symptom input
- **Health Recommendations**: Personalized wellness advice

### Admin Features
- **System Analytics**: Comprehensive dashboard with charts and metrics
- **User Management**: Manage patients, doctors, and admin users
- **Appointment Monitoring**: Track all appointments across the platform
- **Revenue Tracking**: Monitor platform revenue and doctor earnings

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **PDFKit** - PDF generation
- **Nodemailer** - Email services

### AI
- **Gradio** - AI interface
- **Google Gemini API** - AI model
- **OpenAI API** - Alternative AI model
- **LangChain** - AI workflow (optional)

## 📁 Project Structure

```
medical-appointment-system/
├── backend/
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── uploads/             # File uploads directory
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── patient/    # Patient dashboard pages
│   │   │   ├── doctor/     # Doctor dashboard pages
│   │   │   └── admin/      # Admin dashboard pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── ai-assistant/
│   ├── app.py              # Gradio AI assistant
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB 6.x or higher
- Python 3.9 or higher (for AI assistant)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd medical-appointment-system
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **AI Assistant Setup** (Optional)
```bash
cd ../ai-assistant
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

### Configuration

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-appointment-system
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

#### AI Assistant (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Running the Application

1. **Start MongoDB**
```bash
# Make sure MongoDB is running on your system
mongod
```

2. **Start Backend Server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

3. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

4. **Start AI Assistant** (Optional)
```bash
cd ai-assistant
python app.py
# AI assistant runs on http://localhost:7860
```

## 📱 User Roles

### Patient
- Book appointments with doctors
- View appointment history
- Access prescriptions
- Upload medical reports
- Chat with AI health assistant
- Use symptom checker

### Doctor
- Manage appointment requests
- Create prescriptions
- View patient medical history
- Set availability
- Track revenue
- Video consultations

### Admin
- Monitor system analytics
- Manage users (patients, doctors)
- View all appointments
- Track platform revenue
- System settings

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Update password
- `GET /api/users/all` - Get all users (Admin)
- `PUT /api/users/:id/block` - Block/unblock user (Admin)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `PUT /api/doctors/profile` - Update doctor profile
- `PUT /api/doctors/availability` - Update availability
- `POST /api/doctors` - Add doctor (Admin)
- `DELETE /api/doctors/:id` - Delete doctor (Admin)

### Patients
- `GET /api/patients/profile` - Get patient profile
- `PUT /api/patients/profile` - Update patient profile
- `POST /api/patients/medical-history` - Add medical history
- `GET /api/patients/:id` - Get patient by ID

### Appointments
- `GET /api/appointments` - Get appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id/status` - Update status
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Prescriptions
- `GET /api/prescriptions` - Get prescriptions
- `GET /api/prescriptions/:id` - Get single prescription
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/:id/pdf` - Generate PDF

### Medical Reports
- `GET /api/medical-reports` - Get reports
- `POST /api/medical-reports` - Upload report
- `DELETE /api/medical-reports/:id` - Delete report
- `PUT /api/medical-reports/:id/share` - Share with doctor

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### AI
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/symptom-checker` - Symptom analysis
- `GET /api/ai/history` - Get chat history
- `DELETE /api/ai/history` - Clear history

## 🎨 UI Features

- **Modern Healthcare Theme**: Professional blue, white, and teal color scheme
- **Glassmorphism Design**: Modern card designs with blur effects
- **Responsive Layout**: Mobile-first design for all screen sizes
- **Smooth Animations**: Framer Motion for fluid transitions
- **Dark/Light Mode**: Theme toggle support
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: Comprehensive error messages
- **Form Validation**: Client-side validation with feedback

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Protected Routes**: Role-based access control
- **Input Validation**: Express-validator for API validation
- **File Upload Security**: Multer with file type and size restrictions
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data in .env files

## 📊 Database Models

### User
- Personal information (name, email, password, age, gender)
- Role assignment (patient, doctor, admin)
- Account status (active/blocked)

### Doctor
- User reference
- Specialization
- Qualification
- Experience
- Consultation fee
- Availability schedule
- Rating and reviews

### Patient
- User reference
- Blood group
- Allergies
- Chronic diseases
- Emergency contact
- Medical history

### Appointment
- Patient and doctor references
- Date and time slot
- Status (pending, confirmed, completed, cancelled)
- Symptoms and diagnosis
- Consultation type (in-person, video)

### Prescription
- Appointment reference
- Patient and doctor references
- Diagnosis
- Medicines with dosage
- Recommended tests
- Doctor's advice

### MedicalReport
- Patient reference
- Report type and title
- File upload
- Sharing status

### Notification
- User reference
- Title and message
- Type and read status

### ChatHistory
- User reference
- Message history
- Context

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment (e.g., Heroku, Render)
1. Set environment variables
2. Deploy MongoDB (MongoDB Atlas)
3. Push code to deployment platform
4. Configure build and start commands

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the project: `npm run build`
2. Deploy the dist folder
3. Configure environment variables
4. Set up API proxy

### AI Assistant Deployment
1. Deploy to a platform supporting Python (e.g., Hugging Face Spaces, Render)
2. Configure API keys
3. Set environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

© 2024 MediCare AI. All rights reserved.

## ⚠️ Disclaimer

This application is for demonstration purposes. The AI assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 📞 Support

For support, email support@medicare.ai or open an issue in the repository.

## 🙏 Acknowledgments

- Medical icon set by Lucide
- AI models by Google Gemini and OpenAI
- UI components by shadcn/ui inspiration
- Healthcare design best practices

---

Built with ❤️ for better healthcare accessibility
