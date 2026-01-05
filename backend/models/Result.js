const { getFirestore } = require('../config/firebase');

/**
 * Result Model for Firebase Firestore
 * Handles CRUD operations for quiz results
 */

class Result {
  constructor() {
    // Don't initialize Firebase immediately - do it lazily when needed
    this.db = null;
    this.collection = null;
  }

  /**
   * Get Firestore database instance (lazy initialization)
   */
  getDB() {
    if (!this.db) {
      this.db = getFirestore();
      this.collection = this.db.collection('results');
    }
    return this.db;
  }

  /**
   * Get results collection (lazy initialization)
   */
  getCollection() {
    if (!this.collection) {
      this.getDB(); // This will initialize both db and collection
    }
    return this.collection;
  }

  /**
   * Validate result data
   */
  validateResult(resultData) {
    const { userName, totalQuestions, correctAnswers, wrongAnswers, finalScore, timeTaken, answers } = resultData;

    // Required fields validation
    if (!userName || typeof userName !== 'string' || userName.trim().length === 0) {
      throw new Error('User name is required and must be a non-empty string');
    }

    if (typeof totalQuestions !== 'number' || totalQuestions <= 0) {
      throw new Error('Total questions must be a positive number');
    }

    if (typeof correctAnswers !== 'number' || correctAnswers < 0) {
      throw new Error('Correct answers must be a non-negative number');
    }

    if (typeof wrongAnswers !== 'number' || wrongAnswers < 0) {
      throw new Error('Wrong answers must be a non-negative number');
    }

    if (typeof finalScore !== 'number' || finalScore < 0 || finalScore > 100) {
      throw new Error('Final score must be a number between 0 and 100');
    }

    if (typeof timeTaken !== 'number' || timeTaken < 0) {
      throw new Error('Time taken must be a non-negative number');
    }

    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    // Validate answers array
    for (const answer of answers) {
      if (!answer.questionId || typeof answer.questionId !== 'string') {
        throw new Error('Each answer must have a valid questionId');
      }
      
      if (typeof answer.selectedOption !== 'number' || answer.selectedOption < -1 || answer.selectedOption > 3) {
        throw new Error('Selected option must be a number between -1 and 3 (-1 for unanswered)');
      }
      
      if (typeof answer.isCorrect !== 'boolean') {
        throw new Error('isCorrect must be a boolean value');
      }
    }

    return true;
  }

  /**
   * Create a new result
   */
  async create(resultData) {
    try {
      this.validateResult(resultData);

      const result = {
        userName: resultData.userName.trim(),
        totalQuestions: resultData.totalQuestions,
        correctAnswers: resultData.correctAnswers,
        wrongAnswers: resultData.wrongAnswers,
        finalScore: resultData.finalScore,
        timeTaken: resultData.timeTaken,
        answers: resultData.answers,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await this.getCollection().add(result);
      return { id: docRef.id, ...result };
    } catch (error) {
      console.error('Error creating result:', error);
      throw error;
    }
  }

  /**
   * Get all results
   */
  async findAll() {
    try {
      const snapshot = await this.getCollection().orderBy('createdAt', 'desc').get();
      const results = [];
      
      snapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return results;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  }

  /**
   * Get result by ID
   */
  async findById(id) {
    try {
      const doc = await this.getCollection().doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error fetching result by ID:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard (top results)
   */
  async getLeaderboard(limit = 10) {
    try {
      const snapshot = await this.getCollection()
        .orderBy('finalScore', 'desc')
        .orderBy('timeTaken', 'asc')
        .limit(limit)
        .get();

      const leaderboard = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        leaderboard.push({
          id: doc.id,
          userName: data.userName,
          finalScore: data.finalScore,
          correctAnswers: data.correctAnswers,
          timeTaken: data.timeTaken,
          createdAt: data.createdAt
        });
      });

      return leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get user's quiz history
   */
  async findByUserName(userName) {
    try {
      if (!userName || typeof userName !== 'string') {
        throw new Error('Valid username is required');
      }

      const snapshot = await this.getCollection()
        .where('userName', '==', userName.trim())
        .orderBy('createdAt', 'desc')
        .get();

      const userResults = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        userResults.push({
          id: doc.id,
          finalScore: data.finalScore,
          correctAnswers: data.correctAnswers,
          wrongAnswers: data.wrongAnswers,
          timeTaken: data.timeTaken,
          createdAt: data.createdAt
        });
      });

      return userResults;
    } catch (error) {
      console.error('Error fetching user results:', error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  async getStatistics() {
    try {
      const snapshot = await this.getCollection().get();
      
      if (snapshot.empty) {
        return {
          totalParticipants: 0,
          averageScore: 0,
          highestScore: 0,
          averageTime: 0
        };
      }

      let totalScore = 0;
      let totalTime = 0;
      let highestScore = 0;
      const uniqueUsers = new Set();

      snapshot.forEach(doc => {
        const data = doc.data();
        totalScore += data.finalScore;
        totalTime += data.timeTaken;
        highestScore = Math.max(highestScore, data.finalScore);
        uniqueUsers.add(data.userName);
      });

      const totalResults = snapshot.size;

      return {
        totalParticipants: uniqueUsers.size,
        totalAttempts: totalResults,
        averageScore: Math.round(totalScore / totalResults),
        highestScore,
        averageTime: Math.round(totalTime / totalResults)
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  /**
   * Update result
   */
  async update(id, updateData) {
    try {
      const updatePayload = {
        ...updateData,
        updatedAt: new Date()
      };

      await this.getCollection().doc(id).update(updatePayload);
      return await this.findById(id);
    } catch (error) {
      console.error('Error updating result:', error);
      throw error;
    }
  }

  /**
   * Delete result
   */
  async delete(id) {
    try {
      await this.getCollection().doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting result:', error);
      throw error;
    }
  }

  /**
   * Delete all results (for testing)
   */
  async deleteAll() {
    try {
      const snapshot = await this.getCollection().get();
      const batch = this.getDB().batch();
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return snapshot.size;
    } catch (error) {
      console.error('Error deleting all results:', error);
      throw error;
    }
  }

  /**
   * Calculate score percentage
   */
  calculateScore(correctAnswers, totalQuestions = 20) {
    return Math.round((correctAnswers / totalQuestions) * 100);
  }
}

module.exports = new Result();