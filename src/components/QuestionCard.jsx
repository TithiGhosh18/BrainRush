import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult, 
  timeLeft,
  questionNumber,
  totalQuestions 
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Geography': 'bg-blue-500',
      'Science': 'bg-purple-500',
      'Biology': 'bg-green-500',
      'History': 'bg-orange-500',
      'Chemistry': 'bg-red-500',
      'Literature': 'bg-pink-500',
      'Mathematics': 'bg-indigo-500',
      'Technology': 'bg-cyan-500',
      'Art': 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </div>
        </div>
        {timeLeft !== null && (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Category Header */}
        <div className={`${getCategoryColor(question.category)} px-6 py-3`}>
          <span className="text-white font-semibold text-sm">{question.category}</span>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ";
              
              if (showResult) {
                if (index === question.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800 shadow-lg";
                } else if (index === selectedAnswer && index !== question.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                }
              } else if (selectedAnswer === index) {
                buttonClass += "border-blue-500 bg-blue-50 text-blue-800 shadow-lg";
              } else {
                buttonClass += "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && onAnswerSelect(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        showResult && index === question.correctAnswer 
                          ? 'bg-green-500 text-white' 
                          : showResult && index === selectedAnswer && index !== question.correctAnswer
                          ? 'bg-red-500 text-white'
                          : selectedAnswer === index && !showResult
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                    {showResult && index === question.correctAnswer && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && question.explanation && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;