import React, { useState, useEffect, useCallback } from 'react';
import Timer from './Timer';
import { firebaseService } from '../services/firebaseService';

/**
 * QuizQuestion Component - Main quiz interface
 * Handles question display, navigation, answer selection, and submission
 * Now uses Firebase Firestore directly
 */
const QuizQuestion = ({ userName, onQuizComplete, onBackToStart }) => {
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  // Quiz configuration
  const QUIZ_DURATION = 10 * 60; // 10 minutes in seconds

  // Load quiz questions on component mount
  useEffect(() => {
    loadQuestions();
  }, []);

  /**
   * Fetch quiz questions from Firebase Firestore
   */
  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📊 Loading questions...');
      const fetchedQuestions = await firebaseService.fetchQuestions();
      
      if (fetchedQuestions && fetchedQuestions.length === 20) {
        setQuestions(fetchedQuestions);
        console.log('✅ Questions loaded successfully');
      } else {
        throw new Error('Invalid questions data received');
      }
    } catch (err) {
      console.error('❌ Failed to load questions:', err);
      setError(err.message || 'Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle answer selection for current question
   */
  const handleAnswerSelect = (optionIndex) => {
    const questionId = questions[currentQuestionIndex].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  /**
   * Navigate to next question
   */
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  /**
   * Navigate to previous question
   */
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  /**
   * Submit quiz answers to Firebase - memoized to prevent recreation on every render
   */
  const submitQuiz = useCallback(async () => {
    if (submitting) return; // Prevent double submission
    
    try {
      setSubmitting(true);
      
      // Calculate time taken
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      // Prepare answers array for submission
      const answersArray = questions.map(question => ({
        questionId: question.id,
        selectedOption: answers[question.id] ?? -1 // -1 for unanswered
      }));

      // Check for unanswered questions
      const unansweredCount = answersArray.filter(a => a.selectedOption === -1).length;
      
      if (unansweredCount > 0) {
        const confirmSubmit = window.confirm(
          `You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`
        );
        if (!confirmSubmit) {
          setSubmitting(false);
          return;
        }
      }

      // Submit to Firebase
      const submissionData = {
        userName,
        answers: answersArray,
        timeTaken
      };

      console.log('📤 Submitting quiz...');
      const response = await firebaseService.submitQuizResult(submissionData);
      
      if (response.success) {
        console.log('✅ Quiz submitted successfully');
        onQuizComplete(response.result);
      } else {
        throw new Error('Failed to submit quiz');
      }
    } catch (err) {
      console.error('❌ Failed to submit quiz:', err);
      setError(err.message || 'Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  }, [userName, questions, answers, startTime, submitting, onQuizComplete]);

  /**
   * Handle timer expiration - auto submit
   */
  const handleTimeUp = useCallback(() => {
    if (!submitting) {
      alert('Time\'s up! Your quiz will be submitted automatically.');
      submitQuiz();
    }
  }, [submitQuiz, submitting]);

  /**
   * Handle manual quiz submission
   */
  const handleSubmit = () => {
    const confirmSubmit = window.confirm(
      'Are you sure you want to submit your quiz? You cannot change your answers after submission.'
    );
    
    if (confirmSubmit) {
      submitQuiz();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>📊 Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="card">
        <div className="error">
          <h3>❌ Error Loading Quiz</h3>
          <p>{error}</p>
          <div className="button-group">
            <button onClick={loadQuestions} className="btn">
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

  // No questions available
  if (questions.length === 0) {
    return (
      <div className="card">
        <div className="error">
          <h3>📭 No Questions Available</h3>
          <p>There are no quiz questions available at the moment.</p>
          <p>💡 Use Ctrl+Shift+A on the start screen to access the admin panel and add questions.</p>
          <button onClick={onBackToStart} className="btn">
            ← Back to Start
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="quiz-container">
      {/* Quiz Header with Progress and Timer */}
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-info">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="answered-count">
              ({answeredCount} answered)
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <Timer 
          duration={QUIZ_DURATION}
          onTimeUp={handleTimeUp}
          isActive={!submitting}
        />
      </div>

      {/* Question Card */}
      <div className="question-card">
        <div className="question-header">
          <div className="question-number">
            Question {currentQuestion.questionNumber}
            {currentQuestion.category && (
              <span className="question-category"> • {currentQuestion.category}</span>
            )}
            <span className="live-badge">🔴 Live</span>
          </div>
          <h2 className="question-text">{currentQuestion.questionText}</h2>
        </div>

        {/* Answer Options */}
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`option ${selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={index}
                checked={selectedAnswer === index}
                onChange={() => handleAnswerSelect(index)}
                className="option-radio"
              />
              <span className="option-text">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <div className="nav-left">
            <button 
              onClick={onBackToStart}
              className="btn btn-secondary"
              disabled={submitting}
            >
              ← Exit Quiz
            </button>
          </div>

          <div className="nav-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || submitting}
              className="btn btn-secondary"
            >
              ← Previous
            </button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-success"
              >
                {submitting ? '📤 Submitting...' : '✓ Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={submitting}
                className="btn"
              >
                Next →
              </button>
            )}
          </div>

          <div className="nav-right">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-success"
            >
              {submitting ? '📤 Submitting...' : 'Submit Early'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;