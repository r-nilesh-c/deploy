import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  limit,
  where,
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Firebase Service Layer for Quiz Competition App
 * Direct Firestore operations from the frontend
 */

export const firebaseService = {
  /**
   * Fetch all questions from Firestore and randomize them
   * @returns {Promise<Array>} Array of 20 randomized questions
   */
  fetchQuestions: async () => {
    try {
      console.log('🔥 Fetching questions from Firestore...');
      
      const questionsRef = collection(db, 'questions');
      const snapshot = await getDocs(questionsRef);
      
      if (snapshot.empty) {
        throw new Error('No questions found in Firestore. Please seed the database first.');
      }

      // Convert Firestore documents to JavaScript objects
      const allQuestions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`📊 Found ${allQuestions.length} questions in Firestore`);

      if (allQuestions.length < 20) {
        throw new Error(`Not enough questions in database. Found ${allQuestions.length}, need at least 20.`);
      }

      // Randomize and take first 20 questions
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 20);

      // Format questions for the quiz interface
      const formattedQuestions = selectedQuestions.map((q, index) => ({
        id: q.id,
        questionNumber: index + 1,
        questionText: q.question || q.questionText, // Support both field names
        options: q.options,
        category: q.category || 'General Knowledge',
        difficulty: q.difficulty || 'Medium',
        // Don't include correctAnswer in client response for security
      }));

      console.log('✅ Questions formatted and randomized successfully');
      return formattedQuestions;

    } catch (error) {
      console.error('❌ Error fetching questions:', error);
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }
  },

  /**
   * Submit quiz results to Firestore
   * @param {Object} resultData - Quiz result data
   * @returns {Promise<Object>} Submitted result with calculated score
   */
  submitQuizResult: async (resultData) => {
    try {
      console.log('🔥 Submitting quiz result to Firestore...');
      
      const { userName, answers, timeTaken } = resultData;

      // Validate input
      if (!userName || !answers || !Array.isArray(answers)) {
        throw new Error('Invalid submission data');
      }

      if (answers.length !== 20) {
        throw new Error('Quiz must have exactly 20 answers');
      }

      // Fetch the original questions to calculate score
      const questionsRef = collection(db, 'questions');
      const snapshot = await getDocs(questionsRef);
      const questionsMap = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        questionsMap[doc.id] = {
          correctAnswer: data.correctAnswer,
          options: data.options
        };
      });

      // Calculate score
      let correctAnswers = 0;
      const processedAnswers = [];

      for (const answer of answers) {
        const question = questionsMap[answer.questionId];
        if (!question) {
          console.warn(`Question not found: ${answer.questionId}`);
          continue;
        }

        let isCorrect = false;
        
        // Handle both index-based and text-based correct answers
        if (typeof question.correctAnswer === 'number') {
          // Index-based (0, 1, 2, 3)
          isCorrect = question.correctAnswer === answer.selectedOption;
        } else if (typeof question.correctAnswer === 'string') {
          // Text-based - match with option text
          const selectedOptionText = question.options[answer.selectedOption];
          isCorrect = question.correctAnswer === selectedOptionText;
        }

        if (isCorrect) correctAnswers++;

        processedAnswers.push({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect
        });
      }

      const wrongAnswers = 20 - correctAnswers;
      const finalScore = Math.round((correctAnswers / 20) * 100);

      // Prepare result document
      const result = {
        userName: userName.trim(),
        totalQuestions: 20,
        correctAnswers,
        wrongAnswers,
        finalScore,
        timeTaken: timeTaken || 0,
        answers: processedAnswers,
        submittedAt: Timestamp.now(),
        createdAt: Timestamp.now()
      };

      // Save to Firestore
      const resultsRef = collection(db, 'results');
      const docRef = await addDoc(resultsRef, result);

      console.log(`✅ Quiz result saved with ID: ${docRef.id}`);

      return {
        success: true,
        result: {
          id: docRef.id,
          totalQuestions: 20,
          correctAnswers,
          wrongAnswers,
          finalScore,
          timeTaken
        }
      };

    } catch (error) {
      console.error('❌ Error submitting quiz result:', error);
      throw new Error(`Failed to submit quiz: ${error.message}`);
    }
  },

  /**
   * Fetch leaderboard from Firestore
   * @param {number} limitCount - Number of top results to fetch
   * @returns {Promise<Array>} Array of top results
   */
  fetchLeaderboard: async (limitCount = 10) => {
    try {
      console.log('🔥 Fetching leaderboard from Firestore...');
      
      const resultsRef = collection(db, 'results');
      const q = query(
        resultsRef,
        orderBy('finalScore', 'desc'),
        orderBy('timeTaken', 'asc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      
      const leaderboard = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userName: data.userName,
          finalScore: data.finalScore,
          correctAnswers: data.correctAnswers,
          timeTaken: data.timeTaken,
          createdAt: data.createdAt || data.submittedAt
        };
      });

      console.log(`✅ Fetched ${leaderboard.length} leaderboard entries`);
      return leaderboard;

    } catch (error) {
      console.error('❌ Error fetching leaderboard:', error);
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }
  },

  /**
   * Fetch user's quiz history
   * @param {string} userName - User's name
   * @returns {Promise<Array>} Array of user's results
   */
  fetchUserHistory: async (userName) => {
    try {
      console.log(`🔥 Fetching history for user: ${userName}`);
      
      if (!userName || typeof userName !== 'string') {
        throw new Error('Valid username is required');
      }

      const resultsRef = collection(db, 'results');
      const q = query(
        resultsRef,
        where('userName', '==', userName.trim()),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      
      const userHistory = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          finalScore: data.finalScore,
          correctAnswers: data.correctAnswers,
          wrongAnswers: data.wrongAnswers,
          timeTaken: data.timeTaken,
          createdAt: data.createdAt || data.submittedAt
        };
      });

      console.log(`✅ Fetched ${userHistory.length} history entries for ${userName}`);
      return userHistory;

    } catch (error) {
      console.error('❌ Error fetching user history:', error);
      throw new Error(`Failed to fetch user history: ${error.message}`);
    }
  },

  /**
   * Get quiz statistics
   * @returns {Promise<Object>} Statistics object
   */
  getStatistics: async () => {
    try {
      console.log('🔥 Fetching quiz statistics...');
      
      const resultsRef = collection(db, 'results');
      const snapshot = await getDocs(resultsRef);
      
      if (snapshot.empty) {
        return {
          totalParticipants: 0,
          totalAttempts: 0,
          averageScore: 0,
          highestScore: 0,
          averageTime: 0
        };
      }

      let totalScore = 0;
      let totalTime = 0;
      let highestScore = 0;
      const uniqueUsers = new Set();

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        totalScore += data.finalScore || 0;
        totalTime += data.timeTaken || 0;
        highestScore = Math.max(highestScore, data.finalScore || 0);
        uniqueUsers.add(data.userName);
      });

      const totalAttempts = snapshot.size;

      const statistics = {
        totalParticipants: uniqueUsers.size,
        totalAttempts,
        averageScore: totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0,
        highestScore,
        averageTime: totalAttempts > 0 ? Math.round(totalTime / totalAttempts) : 0
      };

      console.log('✅ Statistics calculated:', statistics);
      return statistics;

    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }
};