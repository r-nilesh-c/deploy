import React, { useState } from 'react';
import QuizStart from './components/QuizStart';
import QuizQuestion from './components/QuizQuestion';
import Result from './components/Result';
import Leaderboard from './components/Leaderboard';
import './App.css';

/**
 * Main App Component - Manages the overall quiz application state
 * Handles navigation between different quiz phases: start, quiz, result, leaderboard
 */
function App() {
  // Application state management
  const [currentView, setCurrentView] = useState('start'); // 'start', 'quiz', 'result', 'leaderboard'
  const [userName, setUserName] = useState('');
  const [quizResult, setQuizResult] = useState(null);

  // Handle starting a new quiz
  const handleStartQuiz = (name) => {
    setUserName(name);
    setCurrentView('quiz');
  };

  // Handle quiz completion and show results
  const handleQuizComplete = (result) => {
    setQuizResult(result);
    setCurrentView('result');
  };

  // Navigate back to start screen
  const handleBackToStart = () => {
    setCurrentView('start');
    setUserName('');
    setQuizResult(null);
  };

  // Show leaderboard
  const handleShowLeaderboard = () => {
    setCurrentView('leaderboard');
  };

  // Render appropriate component based on current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'start':
        return (
          <QuizStart 
            onStartQuiz={handleStartQuiz}
            onShowLeaderboard={handleShowLeaderboard}
          />
        );
      case 'quiz':
        return (
          <QuizQuestion 
            userName={userName}
            onQuizComplete={handleQuizComplete}
            onBackToStart={handleBackToStart}
          />
        );
      case 'result':
        return (
          <Result 
            result={quizResult}
            userName={userName}
            onBackToStart={handleBackToStart}
            onShowLeaderboard={handleShowLeaderboard}
          />
        );
      case 'leaderboard':
        return (
          <Leaderboard 
            onBackToStart={handleBackToStart}
          />
        );
      default:
        return (
          <QuizStart 
            onStartQuiz={handleStartQuiz}
            onShowLeaderboard={handleShowLeaderboard}
          />
        );
    }
  };

  return (
    <div className="App">
      <div className="container">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default App;