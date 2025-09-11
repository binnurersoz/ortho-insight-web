
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface BMICalculatorProps {
  onDataChange: (data: { age: number }) => void;
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ onDataChange }) => {
  const [age, setAge] = useState<string>('');

  useEffect(() => {
    if (age) {
      const ageNum = parseInt(age);
      onDataChange({
        age: ageNum
      });
    }
  }, [age, onDataChange]);


  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">
          Enter your details for more accurate analysis
        </p>
      </div>
      
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="max-w-md mx-auto">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Age
            </label>
            <div className="relative">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                min="1"
                max="120"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 text-lg font-medium bg-gray-50 focus:bg-white"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                years
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
