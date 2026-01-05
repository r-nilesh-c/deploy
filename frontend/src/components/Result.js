import React from 'react';

/**
 * Result Component - Displays quiz results and performance summary
 * Shows score, statistics, and navigation options
 */
const Result = ({ result, userName, onBackToStart, onShowLeaderboard }) => {
  // Handle missing result data
  if (!result) {
    return (
      <div className="card">
        <div className="error">
          <h3>No Results Available</h3>
          <p>Unable to display quiz results. Please try taking the quiz again.</p>
          <button onClick={onBackToStart} className="btn">
            Back to Start
          </button>
        </div>
      </div>
    );
  }

  // Extract result data
  const {
    totalQuestions = 20,
    correctAnswers = 0,
    wrongAnswers = 0,
    finalScore = 0,
    timeTaken = 0
  } = result;

  // Calculate performance metrics
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const timeInMinutes = Math.floor(timeTaken / 60);
  const timeInSeconds = timeTaken % 60;

  // Determine performance level and styling
  const getPerformanceLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', class: 'excellent', emoji: '🏆', message: 'Outstanding performance!' };
    if (score >= 75) return { level: 'Good', class: 'good', emoji: '🎉', message: 'Well done!' };
    if (score >= 60) return { level: 'Average', class: 'average', emoji: '👍', message: 'Good effort!' };
    return { level: 'Needs Improvement', class: 'poor', emoji: '📚', message: 'Keep practicing!' };
  };

  const performance = getPerformanceLevel(finalScore);

  // Format time display
  const formatTime = (minutes, seconds) => {
    if (minutes === 0) return `${seconds} seconds`;
    if (seconds === 0) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="result-container">
      <div className="card">
        {/* Result Header */}
        <div className="result-header">
          <h1>🎯 Quiz Complete!</h1>
          <p>Great job, <strong>{userName}</strong>! Here are your results:</p>
        </div>

        {/* Score Display */}
        <div className={`result-score ${performance.class}`}>
          <div className="score-emoji">{performance.emoji}</div>
          <div className="score-value">{finalScore}%</div>
          <div className="score-level">{performance.level}</div>
          <div className="score-message">{performance.message}</div>
        </div>

        {/* Detailed Statistics */}
        <div className="result-details">
          <h3>📊 Detailed Results</h3>
          
          <div className="result-stats">
            <div className="stat-item">
              <span className="stat-value">{correctAnswers}</span>
              <span className="stat-label">Correct Answers</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">{wrongAnswers}</span>
              <span className="stat-label">Wrong Answers</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">{accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">{formatTime(timeInMinutes, timeInSeconds)}</span>
              <span className="stat-label">Time Taken</span>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="performance-analysis">
            <h4>📈 Performance Analysis</h4>
            <div className="analysis-grid">
              <div className="analysis-item">
                <strong>Questions Attempted:</strong> {totalQuestions}
              </div>
              <div className="analysis-item">
                <strong>Success Rate:</strong> {correctAnswers}/{totalQuestions}
              </div>
              <div className="analysis-item">
                <strong>Average Time per Question:</strong> {Math.round(timeTaken / totalQuestions)}s
              </div>
              <div className="analysis-item">
                <strong>Quiz Completion:</strong> 100%
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="score-breakdown">
            <h4>🎯 Score Breakdown</h4>
            <div className="breakdown-bar">
              <div 
                className="breakdown-correct" 
                style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
                title={`Correct: ${correctAnswers}/${totalQuestions}`}
              >
                {correctAnswers > 0 && <span>{correctAnswers}</span>}
              </div>
              <div 
                className="breakdown-wrong" 
                style={{ width: `${(wrongAnswers / totalQuestions) * 100}%` }}
                title={`Wrong: ${wrongAnswers}/${totalQuestions}`}
              >
                {wrongAnswers > 0 && <span>{wrongAnswers}</span>}
              </div>
            </div>
            <div className="breakdown-labels">
              <span className="label-correct">✓ Correct ({correctAnswers})</span>
              <span className="label-wrong">✗ Wrong ({wrongAnswers})</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-actions">
          <div className="button-group">
            <button 
              onClick={onBackToStart}
              className="btn"
            >
              🔄 Take Another Quiz
            </button>
            
            <button 
              onClick={onShowLeaderboard}
              className="btn btn-secondary"
            >
              🏆 View Leaderboard
            </button>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="motivation-message">
          {finalScore >= 90 && (
            <p>🌟 Exceptional work! You're in the top tier of quiz takers!</p>
          )}
          {finalScore >= 75 && finalScore < 90 && (
            <p>🎊 Great job! You have solid knowledge across various topics!</p>
          )}
          {finalScore >= 60 && finalScore < 75 && (
            <p>💪 Good effort! With a bit more practice, you'll be scoring even higher!</p>
          )}
          {finalScore < 60 && (
            <p>📖 Keep learning and practicing! Every quiz makes you smarter!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;