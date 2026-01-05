# Quiz Competition Web Application

A complete full-stack quiz competition web application built with React, Node.js, Express, and MongoDB. Features a modern, responsive UI with real-time timer, question navigation, and leaderboard functionality.

## 🚀 Features

### Core Functionality
- **20 Multiple Choice Questions** per quiz
- **Randomized question order** for each attempt
- **20-minute timer** with auto-submit functionality
- **Question navigation** (Next/Previous buttons)
- **Real-time answer saving** and validation
- **Automatic score calculation** and result display
- **Leaderboard** with top performers
- **User result history** tracking

### User Interface
- **Modern, responsive design** that works on all devices
- **Progress indicator** showing current question and completion status
- **Visual timer** with color-coded warnings
- **Interactive answer selection** with hover effects
- **Comprehensive result summary** with performance analysis
- **Animated leaderboard** with podium display

### Technical Features
- **REST API** architecture
- **Firebase Firestore** database with real-time operations
- **Auto-refresh system** - clears all data on server restart
- **Fresh competition mode** - new leaderboard every restart
- **Error handling** and validation
- **Responsive CSS** with mobile-first design
- **Production-ready** code structure

## 🛠️ Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **Modern CSS** with flexbox and grid layouts
- **Axios** for API communication
- **Responsive design** for all screen sizes

### Backend
- **Node.js** with Express framework
- **Firebase Firestore** for database operations
- **Firebase Admin SDK** for server-side operations
- **CORS** enabled for cross-origin requests
- **Environment configuration** with dotenv

## 📁 Project Structure

```
quiz-competition-app/
├── backend/
│   ├── config/
│   │   ├── database.js          # Firebase connection
│   │   └── firebase.js          # Firebase Admin SDK setup
│   ├── models/
│   │   ├── Question.js          # Question model (Firestore)
│   │   └── Result.js            # Result model (Firestore)
│   ├── routes/
│   │   └── quiz.js              # Quiz API routes
│   ├── .env                     # Environment variables
│   ├── package.json             # Backend dependencies
│   ├── seedData.js              # Sample questions seeder
│   └── server.js                # Express server
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuizStart.js     # Start screen component
│   │   │   ├── QuizQuestion.js  # Main quiz component
│   │   │   ├── Timer.js         # Timer component
│   │   │   ├── Result.js        # Results display
│   │   │   └── Leaderboard.js   # Leaderboard component
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.js               # Main app component
│   │   ├── App.css              # Component styles
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   └── package.json             # Frontend dependencies
├── package.json                 # Root package.json
└── README.md                    # This file
```

## 🔄 Auto-Refresh System

This application includes an **automatic data refresh system** that ensures fresh competitions every time the server starts.

### What Gets Refreshed
- **All user results** are cleared from the database
- **All quiz questions** are refreshed with the latest set
- **Leaderboard** starts completely clean
- **Fresh 20 questions** are loaded (15 Easy + 5 Medium difficulty)

### When Auto-Refresh Happens
- **Every server startup** - automatic refresh on `npm run dev`
- **Manual trigger** - POST request to `/api/refresh`
- **Development restarts** - nodemon restarts trigger refresh

### Benefits
- **Fair competitions** - everyone starts with a clean slate
- **Fresh questions** - prevents memorization of question order
- **Clean leaderboard** - new rankings every session
- **Testing friendly** - easy to reset for new test sessions

### Manual Refresh
You can manually trigger a refresh without restarting the server:

```bash
# Using curl
curl -X POST http://localhost:5000/api/refresh

# Using JavaScript fetch
fetch('/api/refresh', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **Firebase Project** with Firestore enabled
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-competition-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   cd ..
   ```

3. **Set up Firebase**
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Create a service account and download the JSON key
   - Update the `backend/.env` file with your Firebase credentials
   - See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions

4. **Seed the database with sample questions**
   ```bash
   cd backend
   node seedData.js
   ```

5. **Start the application**
   ```bash
   # From the root directory (recommended)
   npm start
   
   # OR start servers separately:
   
   # Backend server (in one terminal)
   cd backend
   npm run dev
   
   # Frontend server (in another terminal)  
   cd frontend
   npm start
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Manual Setup (Alternative)

If you prefer to start servers separately:

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
NODE_ENV=development
```

### Firebase Setup

#### Firebase Project Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Create a service account and download the JSON key
4. Extract the required credentials for your `.env` file

**For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)**

## 📊 Database Schema

### Question Document (Firestore)
```javascript
{
  questionText: "What is the capital of France?",
  options: ["London", "Berlin", "Paris", "Madrid"],
  correctAnswer: 2,           // Index of correct option (0-3)
  category: "Geography",
  difficulty: "Easy",         // Easy, Medium, Hard
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Result Document (Firestore)
```javascript
{
  userName: "John Doe",
  totalQuestions: 20,
  correctAnswers: 15,
  wrongAnswers: 5,
  finalScore: 75,            // Score percentage (0-100)
  timeTaken: 900,            // Time in seconds
  answers: [{               // Array of user answers
    questionId: "question-doc-id",
    selectedOption: 2,
    isCorrect: true
  }],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🌐 API Endpoints

### Quiz Routes (`/api/quiz`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/questions` | Fetch 20 randomized quiz questions |
| POST | `/submit` | Submit quiz answers and get results |
| GET | `/leaderboard` | Get top 10 quiz results |
| GET | `/history/:userName` | Get user's quiz history |
| POST | `/refresh` | **NEW**: Manually refresh all data |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

## 🎯 Usage Guide

### Taking a Quiz
1. **Enter your name** on the start screen
2. **Read the instructions** and quiz details
3. **Click "Start Quiz"** to begin
4. **Answer questions** by selecting one of four options
5. **Navigate** using Next/Previous buttons
6. **Monitor the timer** - it will warn you when time is low
7. **Submit** your quiz or let it auto-submit when time expires
8. **View your results** with detailed performance analysis

### Viewing Leaderboard
1. Click **"View Leaderboard"** from the start screen or results page
2. See **top performers** with scores, accuracy, and completion times
3. View **competition statistics** and your ranking

## 🎨 Customization

### Adding More Questions
1. Edit `backend/seedData.js` to add more questions
2. Run the seeder: `node seedData.js`
3. Or add questions directly to Firestore console

### Changing Quiz Settings
- **Timer duration**: Modify `QUIZ_DURATION` in `QuizQuestion.js`
- **Question count**: Update the API to fetch different amounts
- **Scoring**: Modify the scoring logic in the backend

### Styling
- **Global styles**: Edit `frontend/src/index.css`
- **Component styles**: Edit `frontend/src/App.css`
- **Colors and themes**: Update CSS custom properties

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Use Firebase Firestore (already cloud-based)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Serve static files with a web server
3. Update API URLs for production

### Full-Stack Deployment Options
- **Heroku**: Easy deployment with Firebase Firestore
- **Vercel/Netlify**: Frontend with serverless functions
- **DigitalOcean**: Full control with droplets
- **AWS**: Scalable cloud deployment

## 🧪 Testing

### Manual Testing
1. Test all quiz functionality
2. Verify timer behavior
3. Check responsive design on different devices
4. Test error scenarios (network issues, invalid data)

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Get questions
curl http://localhost:5000/api/quiz/questions

# Submit quiz (example)
curl -X POST http://localhost:5000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"userName":"Test User","answers":[...],"timeTaken":600}'
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Ensure Firebase project is set up correctly
   - Check credentials in `.env` file
   - Verify service account permissions
   - See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for troubleshooting

2. **Port Already in Use**
   - Change ports in configuration
   - Kill existing processes

3. **API Not Responding**
   - Check backend server is running
   - Verify CORS configuration
   - Check network requests in browser dev tools

4. **Questions Not Loading**
   - Run the database seeder
   - Check Firestore has data
   - Verify API endpoints
   - Check Firebase security rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Responsive design principles
- User experience best practices
- Production-ready architecture

## 📞 Support

For support, please create an issue in the repository or contact the development team.

---

**Happy Quizzing! 🧠✨**