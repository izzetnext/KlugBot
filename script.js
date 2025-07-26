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
            playQuiz: document.getElementById('play-quiz'),
            prevQuestion: document.getElementById('prev-question'),
            nextQuestion: document.getElementById('next-question'),
            speakQuestion: document.getElementById('speak-question'),
            micButton: document.getElementById('mic-button'),
            micIcon: document.getElementById('mic-icon'),
            micStatus: document.getElementById('mic-status'),
            questionText: document.getElementById('question-text'),
            currentQuestion: document.getElementById('current-question'),
            answerInput: document.getElementById('answer-input'),
            submitAnswer: document.getElementById('submit-answer'),
            feedback: document.getElementById('feedback'),
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
                this.elements.answerInput.value = transcript;
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
        this.elements.playQuiz.addEventListener('click', () => this.toggleQuiz());
        this.elements.prevQuestion.addEventListener('click', () => this.previousQuestion());
        this.elements.nextQuestion.addEventListener('click', () => this.nextQuestion());
        this.elements.speakQuestion.addEventListener('click', () => this.speakQuestion());
        this.elements.micButton.addEventListener('click', () => this.toggleListening());
        this.elements.submitAnswer.addEventListener('click', () => this.submitAnswer());
        this.elements.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });
        this.elements.languageSelect.addEventListener('change', () => this.updateLanguage());
        this.elements.restartQuiz.addEventListener('click', () => this.restartQuiz());
    }

    updateLanguage() {
        this.currentLanguage = this.elements.languageSelect.value;
        if (this.recognition) {
            this.recognition.lang = this.currentLanguage;
        }
    }

    submitAnswer() {
        const answer = this.elements.answerInput.value.trim();
        if (answer) {
            this.checkAnswer(answer);
            this.elements.answerInput.value = '';
        }
    }

    submitAnswer() {
        const answer = this.elements.answerInput.value.trim();
        if (answer) {
            this.checkAnswer(answer);
            this.elements.answerInput.value = '';
        }
    }

    toggleQuiz() {
        if (this.isQuizActive) {
            this.pauseQuiz();
        } else {
            this.startQuiz();
        }
    }

    startQuiz() {
        this.isQuizActive = true;
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        // Get random questions for current language
        this.questions = getRandomQuestions(this.currentLanguage, 5);
        
        // Update UI
        this.elements.playQuiz.textContent = '⏸';
        this.elements.playQuiz.classList.add('pause');
        this.elements.prevQuestion.disabled = false;
        this.elements.nextQuestion.disabled = false;
        this.elements.speakQuestion.disabled = false;
        this.elements.micButton.disabled = false;
        this.elements.submitAnswer.disabled = false;
        this.elements.totalScore.textContent = this.questions.length;
        this.elements.resultsSection.style.display = 'none';
        
        // Make sure quiz controls are visible
        document.querySelector('.quiz-controls').style.display = 'block';
        
        // Clear previous state
        this.elements.answerInput.value = '';
        this.elements.feedback.className = 'feedback';
        this.elements.feedback.textContent = '';
        
        this.showCurrentQuestion();
    }

    pauseQuiz() {
        this.isQuizActive = false;
        this.elements.playQuiz.textContent = '▶';
        this.elements.playQuiz.classList.remove('pause');
        
        // Stop any ongoing speech
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        this.stopListening();
    }

    showCurrentQuestion() {
        if (this.currentQuestionIndex < this.questions.length) {
            const question = this.questions[this.currentQuestionIndex];
            this.elements.questionText.textContent = question.question;
            
            // Update question info
            const questionInfo = document.querySelector('.question-info');
            if (questionInfo) {
                questionInfo.innerHTML = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}<br>Ready to answer`;
            }
            
            // Clear previous answer and feedback
            this.elements.answerInput.value = '';
            this.elements.feedback.className = 'feedback';
            this.elements.feedback.textContent = '';
            this.elements.micStatus.textContent = 'Type your answer or use microphone after question is read';
            
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

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showCurrentQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.showCurrentQuestion();
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
        
        // Auto-start listening when question finishes speaking
        utterance.onend = () => {
            if (this.isQuizActive && !this.isListening) {
                setTimeout(() => {
                    this.startListening();
                    this.elements.micStatus.textContent = 'Microphone active - speak or type your answer';
                }, 500);
            }
        };
        
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
            this.isListening = true;
            this.elements.micButton.classList.add('recording');
            this.elements.micIcon.src = 'mic-animate.gif';
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
        
        // Update status if quiz is active
        if (this.isQuizActive && this.elements.micStatus.textContent === 'Microphone active - speak or type your answer') {
            this.elements.micStatus.textContent = 'Click microphone to answer again or type your answer';
        }
    }

    checkAnswer(userAnswer) {
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = question.correctAnswers.some(answer => 
            this.normalizeAnswer(userAnswer).includes(this.normalizeAnswer(answer)) ||
            this.normalizeAnswer(answer).includes(this.normalizeAnswer(userAnswer))
        );

        // Stop listening immediately after answer is received
        this.stopListening();

        if (isCorrect) {
            this.score++;
            this.elements.feedback.className = 'feedback correct';
            this.elements.feedback.textContent = '✅ Correct!';
            this.speakFeedback('Correct!');
        } else {
            this.elements.feedback.className = 'feedback incorrect';
            const correctAnswer = question.correctAnswers[0];
            this.elements.feedback.textContent = `❌ Incorrect. The correct answer is: ${correctAnswer}`;
            this.speakFeedback(`Incorrect. The correct answer is ${correctAnswer}`);
        }

        // Update score display
        this.elements.score.textContent = this.score;
        this.elements.micStatus.textContent = 'Processing answer...';
        
        // Auto move to next question after short delay
        setTimeout(() => {
            if (this.isQuizActive) {
                this.nextQuestion();
            }
        }, 2000);
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
        
        // Show results section and hide other controls
        this.elements.resultsSection.style.display = 'block';
        
        // Hide other sections to make room for results
        document.querySelector('.quiz-controls').style.display = 'none';
        
        this.elements.questionText.textContent = 'Quiz Complete! Check your results on the right.';
        
        // Update question info
        const questionInfo = document.querySelector('.question-info');
        if (questionInfo) {
            questionInfo.innerHTML = `All ${this.questions.length} questions completed<br>Great job!`;
        }
        
        // Reset controls
        this.elements.playQuiz.textContent = '▶';
        this.elements.playQuiz.classList.remove('pause');
        this.elements.prevQuestion.disabled = true;
        this.elements.nextQuestion.disabled = true;
        this.elements.speakQuestion.disabled = true;
        this.elements.micButton.disabled = true;
        this.elements.micStatus.textContent = 'Quiz finished';
        
        // Speak final result
        const resultText = `Quiz complete! You scored ${this.score} out of ${this.questions.length}. That's ${percentage} percent.`;
        this.speakFeedback(resultText);
    }

    restartQuiz() {
        // Reset UI
        this.elements.playQuiz.textContent = '▶';
        this.elements.playQuiz.classList.remove('pause');
        this.elements.prevQuestion.disabled = true;
        this.elements.nextQuestion.disabled = true;
        this.elements.speakQuestion.disabled = true;
        this.elements.micButton.disabled = true;
        this.elements.answerInput.disabled = true;
        this.elements.submitAnswer.disabled = true;
        this.elements.resultsSection.style.display = 'none';
        
        // Show quiz controls again
        document.querySelector('.quiz-controls').style.display = 'block';
        
        this.elements.questionText.textContent = 'Welcome to KlugBot! Click Play to begin.';
        
        // Update question info
        const questionInfo = document.querySelector('.question-info');
        if (questionInfo) {
            questionInfo.innerHTML = '5 questions available<br>Ready when you are to start';
        }
        
        this.elements.score.textContent = '0';
        this.elements.totalScore.textContent = '5';
        this.elements.feedback.className = 'feedback';
        this.elements.feedback.textContent = '';
        this.elements.micStatus.textContent = 'Start quiz to begin answering';
        
        // Stop any ongoing speech
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        
        this.stopListening();
        this.isQuizActive = false;
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
