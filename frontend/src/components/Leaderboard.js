import React, { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';

/**
 * Leaderboard Component - Displays top quiz scores and rankings
 * Shows user rankings with scores, accuracy, and completion times
 * Now uses Firebase Firestore directly
 */
const Leaderboard = ({ onBackToStart }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load leaderboard data on component mount
  useEffect(() => {
    loadLeaderboard();
  }, []);

  /**
   * Fetch leaderboard data from Firebase Firestore
   */
  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📊 Loading leaderboard...');
      const leaderboardData = await firebaseService.fetchLeaderboard(10);
      
      setLeaderboard(leaderboardData);
      console.log('✅ Leaderboard loaded successfully');
    } catch (err) {
      console.error('❌ Failed to load leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get rank styling based on position
   */
  const getRankClass = (index) => {
    if (index === 0) return 'rank gold';
    if (index === 1) return 'rank silver';
    if (index === 2) return 'rank bronze';
    return 'rank';
  };

  /**
   * Get rank emoji based on position
   */
  const getRankEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  /**
   * Format time display
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  /**
   * Format date display
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Calculate accuracy percentage
   */
  const calculateAccuracy = (correctAnswers, totalQuestions = 20) => {
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>📊 Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="card">
        <div className="error">
          <h3>❌ Error Loading Leaderboard</h3>
          <p>{error}</p>
          <div className="button-group">
            <button onClick={loadLeaderboard} className="btn">
              🔄 Try Again
            </button>
            <button onClick={onBackToStart} className="btn btn-secondary">
              ← Back to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="card">
        {/* Header */}
        <div className="leaderboard-header">
          <h1>🏆 Cyber Hunt Leaderboard</h1>
          <p>Top cyber hunters in our cybersecurity quiz competition</p>
        </div>

        {/* Leaderboard Content */}
        {leaderboard.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <h3>No Results Yet</h3>
            <p>Be the first to complete a quiz and claim the top spot!</p>
            <p>Results are updated in real-time.</p>
            <button onClick={onBackToStart} className="btn">
              Take the Quiz
            </button>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="podium">
                <div className="podium-container">
                  {/* Second Place */}
                  <div className="podium-place second">
                    <div className="podium-user">
                      <div className="podium-rank">🥈</div>
                      <div className="podium-name">{leaderboard[1].userName}</div>
                      <div className="podium-score">{leaderboard[1].finalScore}%</div>
                    </div>
                    <div className="podium-bar second-bar"></div>
                  </div>

                  {/* First Place */}
                  <div className="podium-place first">
                    <div className="podium-user">
                      <div className="podium-rank">🥇</div>
                      <div className="podium-name">{leaderboard[0].userName}</div>
                      <div className="podium-score">{leaderboard[0].finalScore}%</div>
                    </div>
                    <div className="podium-bar first-bar"></div>
                  </div>

                  {/* Third Place */}
                  <div className="podium-place third">
                    <div className="podium-user">
                      <div className="podium-rank">🥉</div>
                      <div className="podium-name">{leaderboard[2].userName}</div>
                      <div className="podium-score">{leaderboard[2].finalScore}%</div>
                    </div>
                    <div className="podium-bar third-bar"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Leaderboard Table */}
            <div className="leaderboard-table-container">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Correct</th>
                    <th>Accuracy</th>
                    <th>Time</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id || index} className={index < 3 ? 'top-three' : ''}>
                      <td>
                        <span className={getRankClass(index)}>
                          {getRankEmoji(index)}
                        </span>
                      </td>
                      <td className="user-name">
                        <strong>{entry.userName}</strong>
                      </td>
                      <td>
                        <span className="score-badge">
                          {entry.finalScore}%
                        </span>
                      </td>
                      <td>{entry.correctAnswers}/20</td>
                      <td>{calculateAccuracy(entry.correctAnswers)}%</td>
                      <td>{formatTime(entry.timeTaken)}</td>
                      <td className="date-cell">
                        {formatDate(entry.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statistics Summary */}
            <div className="leaderboard-stats">
              <h3>📈 Competition Stats</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{leaderboard.length}</div>
                  <div className="stat-label">Total Participants</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{leaderboard[0]?.finalScore || 0}%</div>
                  <div className="stat-label">Highest Score</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {Math.round(
                      leaderboard.reduce((sum, entry) => sum + entry.finalScore, 0) / 
                      leaderboard.length
                    ) || 0}%
                  </div>
                  <div className="stat-label">Average Score</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {formatTime(
                      Math.round(
                        leaderboard.reduce((sum, entry) => sum + entry.timeTaken, 0) / 
                        leaderboard.length
                      ) || 0
                    )}
                  </div>
                  <div className="stat-label">Average Time</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="leaderboard-actions">
          <div className="button-group">
            <button onClick={onBackToStart} className="btn">
              🚀 Take Quiz
            </button>
            <button onClick={loadLeaderboard} className="btn btn-secondary">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;