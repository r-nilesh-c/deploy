const Question = require('../models/Question');
require('dotenv').config();

// Additional questions to expand the question bank
const additionalQuestions = [
  {
    questionText: "What is the largest planet in our solar system?",
    options: ["Earth", "Jupiter", "Saturn", "Neptune"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "Which programming language was developed by Guido van Rossum?",
    options: ["Java", "Python", "C++", "Ruby"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "Medium"
  },
  {
    questionText: "What is the speed of light in vacuum?",
    options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"],
    correctAnswer: 0,
    category: "Science",
    difficulty: "Hard"
  },
  {
    questionText: "Which country has the most time zones?",
    options: ["Russia", "United States", "China", "France"],
    correctAnswer: 3,
    category: "Geography",
    difficulty: "Hard"
  },
  {
    questionText: "What does 'AI' stand for in technology?",
    options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Intelligence", "Algorithmic Intelligence"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "Easy"
  },
  {
    questionText: "Which ocean is the deepest?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    questionText: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "Which year did the Berlin Wall fall?",
    options: ["1987", "1988", "1989", "1990"],
    correctAnswer: 2,
    category: "History",
    difficulty: "Medium"
  },
  {
    questionText: "What is the most spoken language in the world?",
    options: ["English", "Spanish", "Mandarin Chinese", "Hindi"],
    correctAnswer: 2,
    category: "General Knowledge",
    difficulty: "Medium"
  },
  {
    questionText: "Which company created the Android operating system?",
    options: ["Apple", "Microsoft", "Google", "Samsung"],
    correctAnswer: 2,
    category: "Technology",
    difficulty: "Easy"
  },
  {
    questionText: "What is the formula for water?",
    options: ["H2O", "CO2", "NaCl", "CH4"],
    correctAnswer: 0,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "Which continent is known as the 'Dark Continent'?",
    options: ["Asia", "Africa", "South America", "Australia"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    questionText: "What is the binary representation of the decimal number 10?",
    options: ["1010", "1100", "1001", "1110"],
    correctAnswer: 0,
    category: "Technology",
    difficulty: "Medium"
  },
  {
    questionText: "Who is known as the father of modern physics?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "Which is the longest river in Africa?",
    options: ["Congo River", "Niger River", "Zambezi River", "Nile River"],
    correctAnswer: 3,
    category: "Geography",
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
    questionText: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    questionText: "Which data structure uses LIFO (Last In, First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "Medium"
  },
  {
    questionText: "What is the most abundant gas in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "Which ancient wonder of the world was located in Alexandria?",
    options: ["Hanging Gardens", "Lighthouse of Alexandria", "Colossus of Rhodes", "Temple of Artemis"],
    correctAnswer: 1,
    category: "History",
    difficulty: "Hard"
  },
  {
    questionText: "What is the smallest unit of matter?",
    options: ["Molecule", "Atom", "Electron", "Proton"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "Which country invented the compass?",
    options: ["Greece", "Egypt", "China", "India"],
    correctAnswer: 2,
    category: "History",
    difficulty: "Medium"
  },
  {
    questionText: "What does 'CSS' stand for in web development?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Coded Style Sheets"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "Easy"
  },
  {
    questionText: "Which mountain range contains Mount Everest?",
    options: ["Andes", "Rocky Mountains", "Alps", "Himalayas"],
    correctAnswer: 3,
    category: "Geography",
    difficulty: "Easy"
  }
];

// Function to seed additional questions
const seedAdditionalQuestions = async () => {
  try {
    console.log('🔥 Connecting to Firebase Firestore...');

    // Insert additional questions
    const insertedQuestions = await Question.insertMany(additionalQuestions);
    console.log(`✅ Inserted ${insertedQuestions.length} additional questions`);

    // Get total count
    const totalCount = await Question.count();
    console.log(`📊 Total questions in database: ${totalCount}`);

    console.log('🎉 Additional questions seeded successfully with Firebase Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding additional questions:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAdditionalQuestions();