import React, { useState } from 'react';
import { Play, BookOpen, Clock, Award, Settings, Info } from 'lucide-react';

const WelcomeScreen = ({ onStart, questions }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);

  const categories = [...new Set(questions.map(q => q.category))];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = questions.filter(q => q.category === category).length;
    return acc;
  }, {});

  const difficultyStats = difficulties.reduce((acc, difficulty) => {
    acc[difficulty] = questions.filter(q => q.difficulty === difficulty).length;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive Quiz Challenge
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Test your knowledge across multiple categories with our engaging quiz experience. 
            Track your progress and compete with yourself!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">{questions.length}</h3>
            <p className="text-gray-600">Total Questions</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">{categories.length}</h3>
            <p className="text-gray-600">Categories</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">~{Math.ceil(questions.length * 1.5)}</h3>
            <p className="text-gray-600">Minutes</p>
          </div>
        </div>
      </div>

      {/* Quiz Information */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Info className="w-6 h-6 mr-2 text-blue-500" />
            Quiz Overview
          </h2>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map(category => (
                <div key={category} className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="font-medium text-blue-800">{category}</div>
                  <div className="text-sm text-blue-600">{categoryCounts[category]} questions</div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Difficulty Levels</h3>
            <div className="space-y-3">
              {difficulties.map(difficulty => {
                const count = difficultyStats[difficulty];
                const percentage = Math.round((count / questions.length) * 100);
                const colorClass = {
                  'Easy': 'bg-green-500',
                  'Medium': 'bg-yellow-500',
                  'Hard': 'bg-red-500'
                }[difficulty];

                return (
                  <div key={difficulty} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-700">{difficulty}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colorClass} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 w-16">{count} ({percentage}%)</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quiz Settings
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={(e) => setTimerEnabled(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-800">Enable Timer</div>
                  <div className="text-sm text-gray-600">30 seconds per question for added challenge</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Play</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                  <p>Read each question carefully and select the best answer from the multiple choices provided.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                  <p>Use the "Next" and "Previous" buttons to navigate between questions at your own pace.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                  <p>If timer is enabled, you have 30 seconds per question. Don't worry if time runs out!</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                  <p>After selecting an answer, you'll see the correct answer and an explanation.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">5</div>
                  <p>At the end, you'll see your final score, grade, and performance breakdown by category.</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <button
          onClick={() => onStart(timerEnabled)}
          className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
        >
          <Play className="w-6 h-6 mr-3" />
          Start Quiz
        </button>
        
        <div>
          <button
            onClick={() => setShowInstructions(true)}
            className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors"
          >
            Read Instructions
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;