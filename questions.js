// KlugBot Question Database
const questionDatabase = {
    "en-US": [
        {
            id: 1,
            question: "What is the capital of France?",
            correctAnswers: ["paris", "paris france"],
            category: "Geography"
        },
        {
            id: 2,
            question: "What is 2 plus 2?",
            correctAnswers: ["4", "four"],
            category: "Mathematics"
        },
        {
            id: 3,
            question: "Who painted the Mona Lisa?",
            correctAnswers: ["leonardo da vinci", "da vinci", "leonardo"],
            category: "Art"
        },
        {
            id: 4,
            question: "What is the largest planet in our solar system?",
            correctAnswers: ["jupiter"],
            category: "Science"
        },
        {
            id: 5,
            question: "In which year did World War 2 end?",
            correctAnswers: ["1945", "nineteen forty five"],
            category: "History"
        },
        {
            id: 6,
            question: "What is the chemical symbol for water?",
            correctAnswers: ["h2o", "h 2 o"],
            category: "Science"
        },
        {
            id: 7,
            question: "Which continent is the largest?",
            correctAnswers: ["asia"],
            category: "Geography"
        },
        {
            id: 8,
            question: "Who wrote Romeo and Juliet?",
            correctAnswers: ["william shakespeare", "shakespeare"],
            category: "Literature"
        }
    ],
    "tr-TR": [
        {
            id: 1,
            question: "Türkiye'nin başkenti neresidir?",
            correctAnswers: ["ankara"],
            category: "Coğrafya"
        },
        {
            id: 2,
            question: "3 artı 5 kaçtır?",
            correctAnswers: ["8", "sekiz"],
            category: "Matematik"
        },
        {
            id: 3,
            question: "Türkiye'nin en uzun nehri hangisidir?",
            correctAnswers: ["kızılırmak", "kızıl ırmak"],
            category: "Coğrafya"
        },
        {
            id: 4,
            question: "Güneş sistemindeki en büyük gezegen hangisidir?",
            correctAnswers: ["jüpiter", "jupiter"],
            category: "Bilim"
        },
        {
            id: 5,
            question: "Türkiye Cumhuriyeti hangi yılda kurulmuştur?",
            correctAnswers: ["1923", "bin dokuz yüz yirmi üç"],
            category: "Tarih"
        },
        {
            id: 6,
            question: "Suyun kimyasal formülü nedir?",
            correctAnswers: ["h2o", "h 2 o"],
            category: "Bilim"
        },
        {
            id: 7,
            question: "Dünyanın en büyük kıtası hangisidir?",
            correctAnswers: ["asya"],
            category: "Coğrafya"
        },
        {
            id: 8,
            question: "Romeo ve Juliet'i kim yazmıştır?",
            correctAnswers: ["william shakespeare", "shakespeare"],
            category: "Edebiyat"
        }
    ],
    "de-DE": [
        {
            id: 1,
            question: "Wie heißt die Hauptstadt von Deutschland?",
            correctAnswers: ["berlin"],
            category: "Geographie"
        },
        {
            id: 2,
            question: "Was ist 4 mal 3?",
            correctAnswers: ["12", "zwölf"],
            category: "Mathematik"
        },
        {
            id: 3,
            question: "Wer komponierte die 9. Sinfonie?",
            correctAnswers: ["beethoven", "ludwig van beethoven"],
            category: "Musik"
        },
        {
            id: 4,
            question: "Welcher ist der längste Fluss in Deutschland?",
            correctAnswers: ["rhein"],
            category: "Geographie"
        },
        {
            id: 5,
            question: "In welchem Jahr fiel die Berliner Mauer?",
            correctAnswers: ["1989", "neunzehnhundertneunundachtzig"],
            category: "Geschichte"
        }
    ],
    "es-ES": [
        {
            id: 1,
            question: "¿Cuál es la capital de España?",
            correctAnswers: ["madrid"],
            category: "Geografía"
        },
        {
            id: 2,
            question: "¿Cuánto es 7 por 8?",
            correctAnswers: ["56", "cincuenta y seis"],
            category: "Matemáticas"
        },
        {
            id: 3,
            question: "¿Quién pintó el Guernica?",
            correctAnswers: ["pablo picasso", "picasso"],
            category: "Arte"
        },
        {
            id: 4,
            question: "¿Cuál es el río más largo de España?",
            correctAnswers: ["tajo"],
            category: "Geografía"
        },
        {
            id: 5,
            question: "¿En qué año llegó Colón a América?",
            correctAnswers: ["1492", "mil cuatrocientos noventa y dos"],
            category: "Historia"
        }
    ],
    "fr-FR": [
        {
            id: 1,
            question: "Quelle est la capitale de la France?",
            correctAnswers: ["paris"],
            category: "Géographie"
        },
        {
            id: 2,
            question: "Combien font 9 plus 6?",
            correctAnswers: ["15", "quinze"],
            category: "Mathématiques"
        },
        {
            id: 3,
            question: "Qui a écrit Les Misérables?",
            correctAnswers: ["victor hugo", "hugo"],
            category: "Littérature"
        },
        {
            id: 4,
            question: "Quel est le plus long fleuve de France?",
            correctAnswers: ["loire"],
            category: "Géographie"
        },
        {
            id: 5,
            question: "En quelle année a commencé la Révolution française?",
            correctAnswers: ["1789", "mille sept cent quatre-vingt-neuf"],
            category: "Histoire"
        }
    ]
};

// Function to get questions for a specific language
function getQuestions(language) {
    return questionDatabase[language] || questionDatabase["en-US"];
}

// Function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Function to get random questions
function getRandomQuestions(language, count = 5) {
    const questions = getQuestions(language);
    const shuffled = shuffleArray(questions);
    return shuffled.slice(0, count);
}
