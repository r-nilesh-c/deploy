import React, { useState } from 'react';
import FirebaseAdmin from './FirebaseAdmin';

/**
 * QuizStart Component - Landing page for the quiz application
 * Handles user name input and quiz initiation
 */
const QuizStart = ({ onStartQuiz, onShowLeaderboard }) => {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  // Handle form submission to start quiz
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate user name
    const trimmedName = userName.trim();
    if (!trimmedName) {
      setError('Please enter your name to start the quiz');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Name must be less than 50 characters');
      return;
    }

    // Clear any previous errors and start quiz
    setError('');
    onStartQuiz(trimmedName);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setUserName(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Handle admin panel access (secret key combination)
  const handleAdminAccess = (e) => {
    // Press Ctrl+Shift+A to open admin panel
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      setShowAdmin(true);
    }
  };

  // Add event listener for admin access
  React.useEffect(() => {
    document.addEventListener('keydown', handleAdminAccess);
    return () => document.removeEventListener('keydown', handleAdminAccess);
  }, []);

  return (
    <>
      <div className="card quiz-start">
        <h1>🔐 Cyber Hunt Quiz</h1>
        <p>
          Test your cybersecurity knowledge with our beginner-friendly 20-question quiz! 
          Learn about computer security, safe online habits, and cyber threats while competing with other cyber hunters.
        </p>

        {/* Quiz Information */}
        <div className="quiz-info">
          <h3>📋 Quiz Details</h3>
          <ul>
            <li><strong>Questions:</strong> 20 Multiple Choice Questions</li>
            <li><strong>Time Limit:</strong> 10 minutes (600 seconds)</li>
            <li><strong>Topics:</strong> Computer Security, Internet Safety, Cyber Threats</li>
            <li><strong>Level:</strong> Mixed difficulty (15 Easy + 5 Medium)</li>
            <li><strong>Navigation:</strong> You can go back and change your answers</li>
            <li><strong>Auto-Submit:</strong> Quiz will auto-submit when time runs out</li>
            <li><strong>Scoring:</strong> Each correct answer = 5 points (Max: 100 points)</li>
          </ul>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Start Quiz Form */}
        <form onSubmit={handleSubmit} className="start-form">
          <div className="form-group">
            <label htmlFor="userName" className="form-label">
              Enter Your Name:
            </label>
            <input
              type="text"
              id="userName"
              className="form-input"
              value={userName}
              onChange={handleInputChange}
              placeholder="Your full name"
              maxLength="50"
              autoComplete="name"
              autoFocus
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              🚀 Start Quiz
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onShowLeaderboard}
            >
              🏆 View Leaderboard
            </button>
          </div>
        </form>

        {/* Instructions */}
        <div className="quiz-info">
          <h3>📝 Instructions</h3>
          <ul>
            <li>Read each question carefully before selecting your answer</li>
            <li>You can navigate between questions using Next/Previous buttons</li>
            <li>Selected answers are automatically saved</li>
            <li>Keep an eye on the timer - it will turn red when time is running low</li>
            <li>Submit your quiz before time runs out for best results</li>
            <li>Your score and ranking will be displayed immediately after submission</li>
          </ul>
        </div>

        {/* Admin Access Hint */}
        <div className="admin-hint">
          <small>💡 Press Ctrl+Shift+A for admin panel</small>
        </div>
      </div>

      {/* Firebase Admin Panel */}
      {showAdmin && (
        <FirebaseAdmin onClose={() => setShowAdmin(false)} />
      )}
    </>
  );
};

export default QuizStart;