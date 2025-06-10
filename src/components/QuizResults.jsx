import React from 'react';
import { Trophy, Star, RotateCcw, Share2, Award, Target, Copy } from 'lucide-react';

const QuizResults = ({ score, totalQuestions, answers, questions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getMotivationalMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a quiz champion! 🏆";
    if (percentage >= 80) return "Excellent work! You really know your stuff! ⭐";
    if (percentage >= 70) return "Great job! You're doing well! 👏";
    if (percentage >= 60) return "Good effort! Keep learning and improving! 📚";
    if (percentage >= 50) return "Not bad! There's room for improvement! 💪";
    return "Keep trying! Every attempt makes you smarter! 🚀";
  };

  const gradeInfo = getGrade();

  const categoryStats = questions.reduce((acc, question, index) => {
    const category = question.category;
    if (!acc[category]) {
      acc[category] = { correct: 0, total: 0 };
    }
    acc[category].total++;
    if (answers[index] === question.correctAnswer) {
      acc[category].correct++;
    }
    return acc;
  }, {});

  const handleShare = async () => {
    const shareText = `🎯 Quiz Results: I scored ${score}/${totalQuestions} (${percentage}%) with grade ${gradeInfo.grade}! ${getMotivationalMessage()}`;
    
    try {
      // Check if Web Share API is supported and available
      if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: 'My Quiz Results',
          text: shareText,
          url: window.location.href
        });
        return;
      }
    } catch (error) {
      console.log('Web Share API failed:', error);
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      
      // Show temporary success message
      const button = document.activeElement;
      const originalText = button.innerHTML;
      button.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Copied!';
      
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
      
    } catch (clipboardError) {
      console.log('Clipboard API failed:', clipboardError);
      
      // Final fallback: Show alert with text to copy
      alert(`Copy this text to share your results:\n\n${shareText}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Results Card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-xl opacity-90">{getMotivationalMessage()}</p>
        </div>

        {/* Score Section */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{score}</div>
                <div className="text-gray-600">Correct</div>
              </div>
              <div className="text-6xl text-gray-300">/</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{totalQuestions}</div>
                <div className="text-gray-600">Total</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6">
              <div className={`px-6 py-3 rounded-full ${gradeInfo.bg}`}>
                <span className={`text-2xl font-bold ${gradeInfo.color}`}>
                  {gradeInfo.grade}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {percentage}%
              </div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{percentage}%</span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Performance by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryStats).map(([category, stats]) => {
                const categoryPercentage = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{category}</span>
                      <span className="text-sm font-bold text-gray-600">
                        {stats.correct}/{stats.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${categoryPercentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{categoryPercentage}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Results
            </button>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {percentage >= 90 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white text-center">
            <Award className="w-8 h-8 mx-auto mb-2" />
            <div className="font-bold">Perfect Score!</div>
            <div className="text-sm opacity-90">You got 90%+ correct</div>
          </div>
        )}
        {score === totalQuestions && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white text-center">
            <Star className="w-8 h-8 mx-auto mb-2" />
            <div className="font-bold">Flawless Victory!</div>
            <div className="text-sm opacity-90">100% correct answers</div>
          </div>
        )}
        {percentage >= 80 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="font-bold">Quiz Master!</div>
            <div className="text-sm opacity-90">Excellent performance</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResults;