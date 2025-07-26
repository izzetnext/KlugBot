// KlugBot Main Script v1.0
class KlugBot {
    constructor() {
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.score = 0;
        this.isListening = false;
        this.recognition = null;
        this.speechSynthesis = window.speechSynthesis;
        this.currentLanguage = 'en-US';
        this.isQuizActive = false;

        this.initializeElements();
        this.initializeSpeechRecognition();
        this.bindEvents();
        this.updateLanguage();
    }

    initializeElements() {
        // Get DOM elements
        this.elements = {
            startQuiz: document.getElementById('start-quiz'),
            speakQuestion: document.getElementById('speak-question'),
            micButton: document.getElementById('mic-button'),
            micIcon: document.getElementById('mic-icon'),
            micStatus: document.getElementById('mic-status'),
            questionText: document.getElementById('question-text'),
            currentQuestion: document.getElementById('current-question'),
            totalQuestions: document.getElementById('total-questions'),
            userAnswer: document.getElementById('user-answer'),
            feedback: document.getElementById('feedback'),
            progressFill: document.getElementById('progress-fill'),
            score: document.getElementById('score'),
            totalScore: document.getElementById('total-score'),
            languageSelect: document.getElementById('language-select'),
            resultsSection: document.getElementById('results-section'),
            finalScore: document.getElementById('final-score'),
            finalTotal: document.getElementById('final-total'),
            percentage: document.getElementById('percentage'),
            restartQuiz: document.getElementById('restart-quiz')
        };
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.currentLanguage;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.elements.micButton.classList.add('recording');
                this.elements.micStatus.textContent = 'Listening...';
                this.elements.micIcon.src = 'mic-animate.gif';
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                this.elements.userAnswer.textContent = transcript;
                this.checkAnswer(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
                this.elements.micStatus.textContent = 'Error occurred. Try again.';
            };

            this.recognition.onend = () => {
                this.stopListening();
            };
        } else {
            console.error('Speech recognition not supported');
            this.elements.micButton.disabled = true;
            this.elements.micStatus.textContent = 'Speech recognition not supported';
        }
    }

    bindEvents() {
        this.elements.startQuiz.addEventListener('click', () => this.startQuiz());
        this.elements.speakQuestion.addEventListener('click', () => this.speakQuestion());
        this.elements.micButton.addEventListener('click', () => this.toggleListening());
        this.elements.languageSelect.addEventListener('change', () => this.updateLanguage());
        this.elements.restartQuiz.addEventListener('click', () => this.restartQuiz());
    }

    updateLanguage() {
        this.currentLanguage = this.elements.languageSelect.value;
        if (this.recognition) {
            this.recognition.lang = this.currentLanguage;
        }
    }

    startQuiz() {
        this.isQuizActive = true;
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        // Get random questions for current language
        this.questions = getRandomQuestions(this.currentLanguage, 5);
        
        // Update UI
        this.elements.startQuiz.disabled = true;
        this.elements.speakQuestion.disabled = false;
        this.elements.micButton.disabled = false;
        this.elements.totalQuestions.textContent = this.questions.length;
        this.elements.totalScore.textContent = this.questions.length;
        this.elements.resultsSection.style.display = 'none';
        
        // Clear previous state
        this.elements.userAnswer.textContent = 'Your answer will appear here...';
        this.elements.feedback.className = 'feedback';
        this.elements.feedback.textContent = '';
        
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        if (this.currentQuestionIndex < this.questions.length) {
            const question = this.questions[this.currentQuestionIndex];
            this.elements.questionText.textContent = question.question;
            this.elements.currentQuestion.textContent = this.currentQuestionIndex + 1;
            
            // Update progress
            const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
            this.elements.progressFill.style.width = progress + '%';
            
            // Clear previous answer and feedback
            this.elements.userAnswer.textContent = 'Your answer will appear here...';
            this.elements.feedback.className = 'feedback';
            this.elements.feedback.textContent = '';
            this.elements.micStatus.textContent = 'Click microphone to answer';
            
            // Auto-speak question after a short delay
            setTimeout(() => {
                if (this.isQuizActive) {
                    this.speakQuestion();
                }
            }, 1000);
        } else {
            this.endQuiz();
        }
    }

    speakQuestion() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }

        const question = this.questions[this.currentQuestionIndex];
        const utterance = new SpeechSynthesisUtterance(question.question);
        
        // Set voice based on language
        const voices = this.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(this.currentLanguage.split('-')[0]));
        if (voice) {
            utterance.voice = voice;
        }
        
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        this.speechSynthesis.speak(utterance);
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }

    stopListening() {
        this.isListening = false;
        this.elements.micButton.classList.remove('recording');
        this.elements.micIcon.src = 'mic.gif';
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    checkAnswer(userAnswer) {
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = question.correctAnswers.some(answer => 
            this.normalizeAnswer(userAnswer).includes(this.normalizeAnswer(answer)) ||
            this.normalizeAnswer(answer).includes(this.normalizeAnswer(userAnswer))
        );

        if (isCorrect) {
            this.score++;
            this.elements.feedback.className = 'feedback correct';
            this.elements.feedback.textContent = '✅ Correct! Well done!';
            this.speakFeedback('Correct! Well done!');
        } else {
            this.elements.feedback.className = 'feedback incorrect';
            const correctAnswer = question.correctAnswers[0];
            this.elements.feedback.textContent = `❌ Incorrect. The correct answer is: ${correctAnswer}`;
            this.speakFeedback(`Incorrect. The correct answer is ${correctAnswer}`);
        }

        // Update score display
        this.elements.score.textContent = this.score;
        
        // Move to next question after delay
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.showCurrentQuestion();
        }, 3000);
    }

    normalizeAnswer(answer) {
        return answer.toLowerCase()
                   .replace(/[^\w\s]/g, '') // Remove punctuation
                   .replace(/\s+/g, ' ')    // Normalize whitespace
                   .trim();
    }

    speakFeedback(text) {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice based on language
        const voices = this.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(this.currentLanguage.split('-')[0]));
        if (voice) {
            utterance.voice = voice;
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        this.speechSynthesis.speak(utterance);
    }

    endQuiz() {
        this.isQuizActive = false;
        
        // Update final results
        this.elements.finalScore.textContent = this.score;
        this.elements.finalTotal.textContent = this.questions.length;
        const percentage = Math.round((this.score / this.questions.length) * 100);
        this.elements.percentage.textContent = percentage;
        
        // Show results section
        this.elements.resultsSection.style.display = 'block';
        this.elements.questionText.textContent = 'Quiz Complete!';
        
        // Update progress to 100%
        this.elements.progressFill.style.width = '100%';
        
        // Disable controls
        this.elements.speakQuestion.disabled = true;
        this.elements.micButton.disabled = true;
        this.elements.micStatus.textContent = 'Quiz finished';
        
        // Speak final result
        const resultText = `Quiz complete! You scored ${this.score} out of ${this.questions.length}. That's ${percentage} percent.`;
        this.speakFeedback(resultText);
    }

    restartQuiz() {
        // Reset UI
        this.elements.startQuiz.disabled = false;
        this.elements.speakQuestion.disabled = true;
        this.elements.micButton.disabled = true;
        this.elements.resultsSection.style.display = 'none';
        this.elements.questionText.textContent = 'Welcome to KlugBot! Click Start to begin.';
        this.elements.currentQuestion.textContent = '0';
        this.elements.totalQuestions.textContent = '0';
        this.elements.score.textContent = '0';
        this.elements.totalScore.textContent = '0';
        this.elements.progressFill.style.width = '0%';
        this.elements.userAnswer.textContent = 'Your answer will appear here...';
        this.elements.feedback.className = 'feedback';
        this.elements.feedback.textContent = '';
        this.elements.micStatus.textContent = 'Click microphone to answer';
        
        // Stop any ongoing speech
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        
        this.stopListening();
    }
}

// Initialize KlugBot when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
        new KlugBot();
    };
    
    // Fallback if voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
        new KlugBot();
    }
});
