const { getFirestore } = require('../config/firebase');

/**
 * Question Model for Firebase Firestore
 * Handles CRUD operations for quiz questions
 */

class Question {
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
      this.collection = this.db.collection('questions');
    }
    return this.db;
  }

  /**
   * Get questions collection (lazy initialization)
   */
  getCollection() {
    if (!this.collection) {
      this.getDB(); // This will initialize both db and collection
    }
    return this.collection;
  }

  /**
   * Validate question data
   */
  validateQuestion(questionData) {
    const { questionText, options, correctAnswer, category, difficulty } = questionData;

    // Required fields validation
    if (!questionText || typeof questionText !== 'string' || questionText.trim().length === 0) {
      throw new Error('Question text is required and must be a non-empty string');
    }

    if (!Array.isArray(options) || options.length !== 4) {
      throw new Error('Each question must have exactly 4 options');
    }

    // Validate all options are non-empty strings
    for (let i = 0; i < options.length; i++) {
      if (!options[i] || typeof options[i] !== 'string' || options[i].trim().length === 0) {
        throw new Error(`Option ${i + 1} must be a non-empty string`);
      }
    }

    if (typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer > 3) {
      throw new Error('Correct answer must be a number between 0 and 3');
    }

    // Optional fields validation
    if (category && typeof category !== 'string') {
      throw new Error('Category must be a string');
    }

    if (difficulty && !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      throw new Error('Difficulty must be Easy, Medium, or Hard');
    }

    return true;
  }

  /**
   * Create a new question
   */
  async create(questionData) {
    try {
      this.validateQuestion(questionData);

      const question = {
        questionText: questionData.questionText.trim(),
        options: questionData.options.map(opt => opt.trim()),
        correctAnswer: questionData.correctAnswer,
        category: questionData.category || 'General Knowledge',
        difficulty: questionData.difficulty || 'Medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await this.getCollection().add(question);
      return { id: docRef.id, ...question };
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  /**
   * Get all questions
   */
  async findAll() {
    try {
      const snapshot = await this.getCollection().orderBy('createdAt', 'desc').get();
      const questions = [];
      
      snapshot.forEach(doc => {
        questions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  /**
   * Get random questions for quiz
   */
  async getRandomQuestions(count = 20) {
    try {
      const allQuestions = await this.findAll();
      
      if (allQuestions.length < count) {
        throw new Error(`Not enough questions in database. Need at least ${count} questions.`);
      }

      // Shuffle array and take first 'count' items
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('Error getting random questions:', error);
      throw error;
    }
  }

  /**
   * Get question by ID
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
      console.error('Error fetching question by ID:', error);
      throw error;
    }
  }

  /**
   * Get questions by IDs
   */
  async findByIds(ids) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return [];
      }

      // Firestore 'in' queries are limited to 10 items, so we need to batch
      const questions = [];
      const batchSize = 10;
      
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        const snapshot = await this.getCollection().where('__name__', 'in', batch).get();
        
        snapshot.forEach(doc => {
          questions.push({
            id: doc.id,
            ...doc.data()
          });
        });
      }

      return questions;
    } catch (error) {
      console.error('Error fetching questions by IDs:', error);
      throw error;
    }
  }

  /**
   * Update question
   */
  async update(id, updateData) {
    try {
      if (updateData.questionText || updateData.options || updateData.correctAnswer !== undefined) {
        this.validateQuestion({ ...updateData, questionText: updateData.questionText || 'temp', options: updateData.options || ['a', 'b', 'c', 'd'], correctAnswer: updateData.correctAnswer !== undefined ? updateData.correctAnswer : 0 });
      }

      const updatePayload = {
        ...updateData,
        updatedAt: new Date()
      };

      await this.getCollection().doc(id).update(updatePayload);
      return await this.findById(id);
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  /**
   * Delete question
   */
  async delete(id) {
    try {
      await this.getCollection().doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  /**
   * Count total questions
   */
  async count() {
    try {
      const snapshot = await this.getCollection().get();
      return snapshot.size;
    } catch (error) {
      console.error('Error counting questions:', error);
      throw error;
    }
  }

  /**
   * Delete all questions (for testing/seeding)
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
      console.error('Error deleting all questions:', error);
      throw error;
    }
  }

  /**
   * Bulk insert questions
   */
  async insertMany(questionsArray) {
    try {
      const batch = this.db.batch();
      const results = [];

      for (const questionData of questionsArray) {
        this.validateQuestion(questionData);
        
        const question = {
          questionText: questionData.questionText.trim(),
          options: questionData.options.map(opt => opt.trim()),
          correctAnswer: questionData.correctAnswer,
          category: questionData.category || 'General Knowledge',
          difficulty: questionData.difficulty || 'Medium',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const docRef = this.getCollection().doc();
        batch.set(docRef, question);
        results.push({ id: docRef.id, ...question });
      }

      await batch.commit();
      return results;
    } catch (error) {
      console.error('Error bulk inserting questions:', error);
      throw error;
    }
  }
}

module.exports = new Question();