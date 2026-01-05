const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Result = require('../models/Result');

// GET /api/quiz/questions - Fetch randomized quiz questions
router.get('/questions', async (req, res) => {
  try {
    // Fetch 20 random questions
    const questions = await Question.getRandomQuestions(20);

    if (questions.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Not enough questions in database. Need at least 20 questions.'
      });
    }

    // Remove correct answers from response for security
    const questionsForClient = questions.map((q, index) => ({
      id: q.id,
      questionNumber: index + 1,
      questionText: q.questionText,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty
    }));

    res.json({
      success: true,
      questions: questionsForClient,
      totalQuestions: questionsForClient.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz questions'
    });
  }
});

// POST /api/quiz/submit - Submit quiz answers and calculate score
router.post('/submit', async (req, res) => {
  try {
    const { userName, answers, timeTaken } = req.body;

    // Validate input
    if (!userName || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission data'
      });
    }

    if (answers.length !== 20) {
      return res.status(400).json({
        success: false,
        message: 'Quiz must have exactly 20 answers'
      });
    }

    // Fetch questions to verify answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.findByIds(questionIds);

    if (questions.length !== 20) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question IDs provided'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) {
        continue; // Skip if question not found
      }
      
      const isCorrect = question.correctAnswer === answer.selectedOption;
      
      if (isCorrect) correctAnswers++;

      processedAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect
      });
    }

    const wrongAnswers = 20 - correctAnswers;
    const finalScore = Math.round((correctAnswers / 20) * 100);

    // Save result to Firestore
    const resultData = {
      userName,
      totalQuestions: 20,
      correctAnswers,
      wrongAnswers,
      finalScore,
      timeTaken: timeTaken || 0,
      answers: processedAnswers
    };

    const result = await Result.create(resultData);

    res.json({
      success: true,
      result: {
        totalQuestions: 20,
        correctAnswers,
        wrongAnswers,
        finalScore,
        timeTaken,
        resultId: result.id
      }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz'
    });
  }
});

// GET /api/quiz/leaderboard - Get top scores
router.get('/leaderboard', async (req, res) => {
  try {
    const topResults = await Result.getLeaderboard(10);

    res.json({
      success: true,
      leaderboard: topResults
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

// GET /api/quiz/history/:userName - Get user's quiz history
router.get('/history/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    const userResults = await Result.findByUserName(userName);

    res.json({
      success: true,
      history: userResults
    });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user history'
    });
  }
});

// GET /api/quiz/statistics - Get quiz statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await Result.getStatistics();

    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;