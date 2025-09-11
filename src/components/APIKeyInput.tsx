
import React, { useState } from 'react';
import { Key, Save, AlertCircle } from 'lucide-react';

interface APIKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      localStorage.setItem('orthodontist_api_key', apiKey.trim());
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Key className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        API Configuration
      </h2>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-1">API Base URL Required</p>
          <p>Please set your API base URL in the api.ts file before using the analysis features.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Base URL
          </label>
          <input
            type={isVisible ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="https://your-api-domain.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            {isVisible ? 'Hide' : 'Show'} URL
          </button>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Configuration</span>
        </button>
      </form>
    </div>
  );
};

export default APIKeyInput;
