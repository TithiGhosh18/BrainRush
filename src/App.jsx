import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionCard from './components/QuestionCard';
import QuizResults from './components/QuizResults';
import questions from './data/questions';

const App = () => {
  const [gameState, setGameState] = useState('welcome'); // 'welcome', 'playing', 'results'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setTimerActive(false);
            handleAnswerSelect(-1); // Auto-submit with no answer
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  const startQuiz = (enableTimer) => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(-1));
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimerEnabled(enableTimer);
    if (enableTimer) {
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setTimerActive(false);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);

    if (answerIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    setShowResult(true);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
      setShowResult(answers[currentQuestionIndex + 1] !== -1);
      
      if (timerEnabled && answers[currentQuestionIndex + 1] === -1) {
        setTimeLeft(30);
        setTimerActive(true);
      } else {
        setTimerActive(false);
      }
    } else {
      setGameState('results');
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
      setShowResult(answers[currentQuestionIndex - 1] !== -1);
      setTimerActive(false);
    }
  };

  const finishQuiz = () => {
    setGameState('results');
  };

  const restartQuiz = () => {
    setGameState('welcome');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimerEnabled(false);
    setTimeLeft(30);
    setTimerActive(false);
  };

  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <WelcomeScreen onStart={startQuiz} questions={questions} />
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <QuizResults 
          score={score}
          totalQuestions={questions.length}
          answers={answers}
          questions={questions}
          onRestart={restartQuiz}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canGoNext = selectedAnswer !== null || showResult;
  const canGoPrevious = currentQuestionIndex > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={restartQuiz}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Back to Home
          </button>
          <div className="text-sm text-gray-600">
            Progress: {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </div>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showResult={showResult}
          timeLeft={timerEnabled ? timeLeft : null}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={goToPreviousQuestion}
            disabled={!canGoPrevious}
            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              canGoPrevious
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <div className="flex space-x-4">
            {isLastQuestion ? (
              <button
                onClick={finishQuiz}
                disabled={!showResult}
                className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  showResult
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Flag className="w-5 h-5 mr-2" />
                Finish Quiz
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                disabled={!canGoNext}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  canGoNext
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{currentQuestionIndex + 1}</div>
              <div className="text-xs text-gray-600">Current</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{answers.filter(a => a !== -1).length}</div>
              <div className="text-xs text-gray-600">Answered</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{questions.length}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;