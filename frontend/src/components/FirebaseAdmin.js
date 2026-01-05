import React, { useState } from 'react';
import { seedFirestore, getQuestionCount, clearQuestions } from '../utils/seedFirestore';

/**
 * Firebase Admin Component
 * Provides tools for managing Firestore data
 */
const FirebaseAdmin = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [questionCount, setQuestionCount] = useState(null);

  // Check current question count
  const handleCheckCount = async () => {
    try {
      setLoading(true);
      setMessage('Checking question count...');
      
      const count = await getQuestionCount();
      setQuestionCount(count);
      setMessage(`Found ${count} questions available`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Seed Firestore with questions
  const handleSeedFirestore = async () => {
    try {
      setLoading(true);
      setMessage('Adding quiz questions...');
      
      const result = await seedFirestore();
      setQuestionCount(result.added);
      setMessage(`✅ Successfully added ${result.added} questions!`);
    } catch (error) {
      setMessage(`❌ Error adding questions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear all questions
  const handleClearQuestions = async () => {
    if (!window.confirm('Are you sure you want to delete ALL questions? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setMessage('Clearing all questions...');
      
      const count = await clearQuestions();
      setQuestionCount(0);
      setMessage(`✅ Cleared ${count} questions`);
    } catch (error) {
      setMessage(`❌ Error clearing questions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="firebase-admin-overlay">
      <div className="firebase-admin-modal">
        <div className="admin-header">
          <h2>⚙️ Admin Panel</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="admin-content">
          <div className="admin-section">
            <h3>📊 Quiz Status</h3>
            <div className="status-info">
              {questionCount !== null && (
                <p><strong>Available Questions:</strong> {questionCount}</p>
              )}
            </div>
            <button 
              onClick={handleCheckCount} 
              disabled={loading}
              className="btn btn-secondary"
            >
              Check Question Count
            </button>
          </div>

          <div className="admin-section">
            <h3>🌱 Add Questions</h3>
            <p>Add 20 cybersecurity quiz questions</p>
            <p><strong>Difficulty:</strong> 15 Easy + 5 Medium level questions</p>
            <p><strong>Topics:</strong> Computer viruses, passwords, networks, hacking, social engineering, ransomware, and more!</p>
            <button 
              onClick={handleSeedFirestore} 
              disabled={loading}
              className="btn btn-success"
            >
              {loading ? 'Adding...' : 'Add Quiz Questions'}
            </button>
          </div>

          <div className="admin-section">
            <h3>🗑️ Clear Questions</h3>
            <p className="warning">⚠️ This will delete ALL questions permanently!</p>
            <button 
              onClick={handleClearQuestions} 
              disabled={loading}
              className="btn btn-danger"
            >
              Clear All Questions
            </button>
          </div>

          {message && (
            <div className={`admin-message ${message.includes('Error') || message.includes('❌') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Processing...</p>
            </div>
          )}
        </div>

        <div className="admin-footer">
          <p>💡 Use this panel to manage your quiz questions</p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseAdmin;