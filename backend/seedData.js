const Question = require('./models/Question');
require('dotenv').config();

// Sample quiz questions for seeding the database
const sampleQuestions = [
  {
    questionText: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Easy"
  },
  {
    questionText: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "What is 15 + 27?",
    options: ["41", "42", "43", "44"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    questionText: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "Medium"
  },
  {
    questionText: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    category: "Geography",
    difficulty: "Easy"
  },
  {
    questionText: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    category: "History",
    difficulty: "Medium"
  },
  {
    questionText: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "Which programming language is known as the 'language of the web'?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: 2,
    category: "Technology",
    difficulty: "Easy"
  },
  {
    questionText: "What is the square root of 144?",
    options: ["11", "12", "13", "14"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    questionText: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art",
    difficulty: "Medium"
  },
  {
    questionText: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    questionText: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "What is the longest river in the world?",
    options: ["Amazon River", "Nile River", "Mississippi River", "Yangtze River"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    questionText: "In which sport would you perform a slam dunk?",
    options: ["Tennis", "Basketball", "Volleyball", "Baseball"],
    correctAnswer: 1,
    category: "Sports",
    difficulty: "Easy"
  },
  {
    questionText: "What does 'HTTP' stand for?",
    options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transport Protocol", "High Transfer Text Protocol"],
    correctAnswer: 0,
    category: "Technology",
    difficulty: "Medium"
  },
  {
    questionText: "Which continent is the largest by area?",
    options: ["Africa", "North America", "Asia", "Europe"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Easy"
  },
  {
    questionText: "What is 8 × 7?",
    options: ["54", "56", "58", "60"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    questionText: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "What is the currency of Japan?",
    options: ["Yuan", "Won", "Yen", "Rupee"],
    correctAnswer: 2,
    category: "General Knowledge",
    difficulty: "Easy"
  },
  {
    questionText: "Which gas makes up approximately 78% of Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "In which city is the Statue of Liberty located?",
    options: ["Boston", "Philadelphia", "New York City", "Washington D.C."],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Easy"
  },
  {
    questionText: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "Which company created the iPhone?",
    options: ["Samsung", "Google", "Microsoft", "Apple"],
    correctAnswer: 3,
    category: "Technology",
    difficulty: "Easy"
  },
  {
    questionText: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "In which year was the first iPhone released?",
    options: ["2006", "2007", "2008", "2009"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "Medium"
  }
];

// Function to seed the database with sample questions
const seedDatabase = async () => {
  try {
    console.log('🔥 Connecting to Firebase Firestore...');

    // Clear existing questions
    const deletedCount = await Question.deleteAll();
    console.log(`🗑️  Cleared ${deletedCount} existing questions`);

    // Insert sample questions
    const insertedQuestions = await Question.insertMany(sampleQuestions);
    console.log(`✅ Inserted ${insertedQuestions.length} sample questions`);

    // Get total count
    const totalCount = await Question.count();
    console.log(`📊 Total questions in database: ${totalCount}`);

    console.log('🎉 Database seeded successfully with Firebase Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();