import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Meal Planner
              </h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Shuffle All
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MealPlannerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function MealPlannerPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Weekly Dinner Plan
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-gray-600">
            Enter your meal preferences to get started with personalized dinner ideas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((slot) => (
          <div key={slot} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-lg font-medium">{slot}</span>
              </div>
              <p className="text-sm">Dinner Slot {slot}</p>
              <p className="text-xs text-gray-400 mt-1">Awaiting suggestions...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
