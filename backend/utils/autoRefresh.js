const { getFirestore } = require('../config/firebase');

/**
 * Auto Refresh Utility
 * Automatically clears all user data and refreshes questions on server startup
 */

// Quiz questions - same as frontend but for server-side seeding
const quizQuestions = [
  {
    question: "What is a computer virus?",
    options: [
      "Hardware problem",
      "A software program that harms a computer",
      "An operating system",
      "A network device"
    ],
    correctAnswer: "A software program that harms a computer"
  },
  {
    question: "What does a password protect?",
    options: [
      "Monitor",
      "Internet speed",
      "User account",
      "Keyboard"
    ],
    correctAnswer: "User account"
  },
  {
    question: "Which device connects computers in a network?",
    options: [
      "Printer",
      "Switch",
      "Scanner",
      "Monitor"
    ],
    correctAnswer: "Switch"
  },
  {
    question: "What is the Internet?",
    options: [
      "Single computer",
      "Collection of networks",
      "Software",
      "Virus"
    ],
    correctAnswer: "Collection of networks"
  },
  {
    question: "What does Wi-Fi allow?",
    options: [
      "Wired connection",
      "Wireless internet access",
      "Virus protection",
      "File deletion"
    ],
    correctAnswer: "Wireless internet access"
  },
  {
    question: "What is a SQL injection attack?",
    options: [
      "Injecting medicine into databases",
      "Inserting malicious code into database queries",
      "Adding new SQL software",
      "Updating database records"
    ],
    correctAnswer: "Inserting malicious code into database queries"
  },
  {
    question: "What is hacking?",
    options: [
      "Fixing a computer",
      "Unauthorized access to systems",
      "Installing software",
      "Updating OS"
    ],
    correctAnswer: "Unauthorized access to systems"
  },
  {
    question: "What does DDoS stand for?",
    options: [
      "Direct Denial of Service",
      "Distributed Denial of Service",
      "Data Denial of Service",
      "Dynamic Denial of Service"
    ],
    correctAnswer: "Distributed Denial of Service"
  },
  {
    question: "What is an IP address?",
    options: [
      "Password",
      "Network device",
      "Unique address of a computer",
      "Virus"
    ],
    correctAnswer: "Unique address of a computer"
  },
  {
    question: "What does antivirus software do?",
    options: [
      "Increases internet speed",
      "Removes viruses",
      "Creates files",
      "Connects networks"
    ],
    correctAnswer: "Removes viruses"
  },
  {
    question: "Which one is an example of personal information?",
    options: [
      "Website name",
      "Phone number",
      "Browser",
      "Search engine"
    ],
    correctAnswer: "Phone number"
  },
  {
    question: "What is social engineering in cybersecurity?",
    options: [
      "Building social networks",
      "Manipulating people to reveal confidential information",
      "Engineering social media platforms",
      "Creating social software"
    ],
    correctAnswer: "Manipulating people to reveal confidential information"
  },
  {
    question: "What should you do before clicking a link?",
    options: [
      "Ignore it",
      "Check the source",
      "Share it",
      "Download it"
    ],
    correctAnswer: "Check the source"
  },
  {
    question: "What is email used for?",
    options: [
      "Playing games",
      "Sending messages",
      "Virus scanning",
      "Network routing"
    ],
    correctAnswer: "Sending messages"
  },
  {
    question: "What is a zero-day vulnerability?",
    options: [
      "A vulnerability that takes zero days to fix",
      "A security flaw unknown to security vendors",
      "A vulnerability that occurs on day zero",
      "A harmless security issue"
    ],
    correctAnswer: "A security flaw unknown to security vendors"
  },
  {
    question: "What is phishing?",
    options: [
      "Catching fish online",
      "Fraudulent attempt to steal personal information",
      "Network protocol",
      "Computer hardware"
    ],
    correctAnswer: "Fraudulent attempt to steal personal information"
  },
  {
    question: "What does HTTPS mean?",
    options: [
      "HyperText Transfer Protocol Secure",
      "High Transfer Text Protocol",
      "HyperText Transport Protocol",
      "High Tech Transfer Protocol"
    ],
    correctAnswer: "HyperText Transfer Protocol Secure"
  },
  {
    question: "What is ransomware?",
    options: [
      "Free software for everyone",
      "Malware that encrypts files and demands payment",
      "Antivirus protection software",
      "Operating system update"
    ],
    correctAnswer: "Malware that encrypts files and demands payment"
  },
  {
    question: "What is two-factor authentication?",
    options: [
      "Using two passwords",
      "Additional security layer requiring two forms of verification",
      "Two antivirus programs",
      "Two computers"
    ],
    correctAnswer: "Additional security layer requiring two forms of verification"
  },
  {
    question: "What should you do if you receive a suspicious email?",
    options: [
      "Open all attachments",
      "Reply immediately",
      "Delete it or report as spam",
      "Forward to friends"
    ],
    correctAnswer: "Delete it or report as spam"
  }
];

/**
 * Clear all user results from Firestore
 */
const clearAllResults = async () => {
  try {
    console.log('🗑️ Clearing all user results...');
    
    const db = getFirestore();
    const resultsRef = db.collection('results');
    const snapshot = await resultsRef.get();
    
    if (snapshot.empty) {
      console.log('📭 No user results to clear');
      return 0;
    }
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`✅ Cleared ${snapshot.size} user results`);
    return snapshot.size;
  } catch (error) {
    console.error('❌ Error clearing results:', error);
    throw error;
  }
};

/**
 * Clear all questions from Firestore
 */
const clearAllQuestions = async () => {
  try {
    console.log('🗑️ Clearing all questions...');
    
    const db = getFirestore();
    const questionsRef = db.collection('questions');
    const snapshot = await questionsRef.get();
    
    if (snapshot.empty) {
      console.log('📭 No questions to clear');
      return 0;
    }
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`✅ Cleared ${snapshot.size} questions`);
    return snapshot.size;
  } catch (error) {
    console.error('❌ Error clearing questions:', error);
    throw error;
  }
};

/**
 * Add fresh questions to Firestore
 */
const seedFreshQuestions = async () => {
  try {
    console.log('🌱 Adding fresh questions...');
    
    const db = getFirestore();
    const questionsRef = db.collection('questions');
    
    // Define difficulty levels for each question
    const difficultyLevels = [
      'Easy', 'Easy', 'Easy', 'Easy', 'Easy',           // Questions 1-5: Easy
      'Medium', 'Easy', 'Medium', 'Easy', 'Easy',       // Questions 6-10: Mixed
      'Easy', 'Medium', 'Easy', 'Easy', 'Medium',       // Questions 11-15: Mixed  
      'Easy', 'Easy', 'Medium', 'Easy', 'Easy'          // Questions 16-20: Mixed
    ];
    
    const batch = db.batch();
    
    quizQuestions.forEach((question, index) => {
      const docRef = questionsRef.doc();
      batch.set(docRef, {
        ...question,
        category: 'Cybersecurity',
        difficulty: difficultyLevels[index],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
    
    console.log(`✅ Added ${quizQuestions.length} fresh questions`);
    console.log(`📊 Difficulty: 15 Easy + 5 Medium level questions`);
    return quizQuestions.length;
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    throw error;
  }
};

/**
 * Complete auto-refresh process
 * Clears all user data and refreshes questions
 */
const autoRefreshData = async () => {
  try {
    console.log('\n🔄 ===== AUTO REFRESH STARTED =====');
    console.log('🎯 Clearing all data and refreshing questions...');
    
    const startTime = Date.now();
    
    // Step 1: Clear all user results
    const clearedResults = await clearAllResults();
    
    // Step 2: Clear all questions
    const clearedQuestions = await clearAllQuestions();
    
    // Step 3: Add fresh questions
    const addedQuestions = await seedFreshQuestions();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n🎉 ===== AUTO REFRESH COMPLETED =====');
    console.log(`📊 Results cleared: ${clearedResults}`);
    console.log(`📊 Questions cleared: ${clearedQuestions}`);
    console.log(`📊 Questions added: ${addedQuestions}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log('🚀 Server ready for fresh competition!\n');
    
    return {
      success: true,
      clearedResults,
      clearedQuestions,
      addedQuestions,
      duration
    };
  } catch (error) {
    console.error('\n💥 ===== AUTO REFRESH FAILED =====');
    console.error('❌ Error during auto refresh:', error);
    console.error('⚠️ Server may not have fresh data!\n');
    throw error;
  }
};

/**
 * Get current data counts for verification
 */
const getDataCounts = async () => {
  try {
    const db = getFirestore();
    
    const questionsSnapshot = await db.collection('questions').get();
    const resultsSnapshot = await db.collection('results').get();
    
    return {
      questions: questionsSnapshot.size,
      results: resultsSnapshot.size
    };
  } catch (error) {
    console.error('❌ Error getting data counts:', error);
    return { questions: 0, results: 0 };
  }
};

module.exports = {
  autoRefreshData,
  clearAllResults,
  clearAllQuestions,
  seedFreshQuestions,
  getDataCounts
};