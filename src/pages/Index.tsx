
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Loader2, Camera, User, Brain, FileText, Info, MapPin } from 'lucide-react';
import PhotoUpload from '../components/PhotoUpload';
import BMICalculator from '../components/BMICalculator';
import DiagnosisResults from '../components/DiagnosisResults';
import MalocclusionInfo from '../components/MalocclusionInfo';
import OrthodontistFinder from '../components/OrthodontistFinder';
import { toast } from 'sonner';
import { OrthodontistApi } from '../services/api';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [userInfo, setUserInfo] = useState({
    age: 0
  });
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showMalocclusionInfo, setShowMalocclusionInfo] = useState(false);
  const [showOrthodontistFinder, setShowOrthodontistFinder] = useState(false);

  const steps = [
    { 
      number: 1, 
      title: 'Upload Photo', 
      description: 'Upload your profile photo',
      icon: Camera,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      number: 2, 
      title: 'Personal Info', 
      description: 'Enter your age',
      icon: User,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      number: 3, 
      title: 'Analysis', 
      description: 'Orthodontic evaluation',
      icon: Brain,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      number: 4, 
      title: 'Results', 
      description: 'View your diagnosis and recommendations',
      icon: FileText,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedPhoto !== null;
      case 2:
        return userInfo.age > 0;
      case 3:
        return selectedPhoto !== null && userInfo.age > 0;
      default:
        return true;
    }
  };

  const performAnalysis = async () => {
    if (!selectedPhoto) {
      toast.error('Photo upload is required');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Step 1: Validate photo posture
      setAnalysisProgress(25);
      toast.info('Validating photo posture...');
      
      const validation = await OrthodontistApi.validatePosture(selectedPhoto);
      if (validation.result === 'invalid') {
        toast.error(validation.message || 'Invalid photo posture');
        setIsAnalyzing(false);
        return;
      }
      
      setAnalysisProgress(50);
      toast.success('Photo posture validated successfully');
      
      // Step 2: Perform comprehensive analysis
      setAnalysisProgress(75);
      toast.info('Analyzing orthodontic classification...');
      
      const result = await OrthodontistApi.performComprehensiveAnalysis(selectedPhoto, userInfo.age);
      
      setAnalysisProgress(100);
      setDiagnosis(result);
      toast.success('Analysis completed successfully!');
      setCurrentStep(4);
      
    } catch (error) {
      console.error('AWS Backend Analysis failed:', error);
      toast.error(error instanceof Error ? error.message : 'AWS Backend analysis failed');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleNext = async () => {
    if (currentStep === 3) {
      await performAnalysis();
    } else if (canProceedToNext()) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please complete the current step');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PhotoUpload onPhotoSelect={setSelectedPhoto} selectedPhoto={selectedPhoto} />;
      case 2:
        return <BMICalculator onDataChange={setUserInfo} />;
      case 3:
        return (
          <div className="w-full max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 opacity-60"></div>
              <div className="relative z-10 flex flex-col items-center space-y-8">
                {isAnalyzing ? (
                  <>
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        <Brain className="w-12 h-12 text-white animate-bounce" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Analysis in Progress...
                      </h2>
                      <p className="text-lg text-gray-600 max-w-md">
                        {analysisProgress < 30 ? 'Validating photo posture...' :
                         analysisProgress < 60 ? 'Analyzing facial structure...' :
                         analysisProgress < 90 ? 'Determining classification...' :
                         'Finalizing results...'}
                      </p>
                    </div>
                    <div className="w-full max-w-sm bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 flex items-center justify-center">
                      <img src="./lovable-uploads/85bb4102-7230-497b-acee-a1b59f339a62.png" alt="Analysis" className="w-24 h-24" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Ready for Analysis
                      </h2>
                      <p className="text-lg text-gray-600 max-w-md">
                        Click the button to start orthodontic evaluation
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 w-full max-w-md border border-blue-100">
                      <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <Brain className="w-5 h-5 mr-2" />
                        Analysis Steps:
                      </h3>
                      <ul className="text-sm text-blue-700 space-y-2 text-left">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          Photo posture validation
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          Class III vs Non-Class III detection
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          Class II vs Class I classification
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          Age-specific analysis (14+ adult models)
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <DiagnosisResults 
            diagnosis={diagnosis} 
            confidence={0.85}
            userInfo={userInfo}
            onFindOrthodontist={() => setShowOrthodontistFinder(true)}
          />
        );
      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep - 1];

  if (showMalocclusionInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="flex justify-center py-8">
          <MalocclusionInfo onClose={() => setShowMalocclusionInfo(false)} />
        </div>
      </div>
    );
  }

  if (showOrthodontistFinder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="flex justify-center py-8">
          <OrthodontistFinder onClose={() => setShowOrthodontistFinder(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="./lovable-uploads/85bb4102-7230-497b-acee-a1b59f339a62.png" alt="Orthodontist" className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Orthodontist
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowMalocclusionInfo(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <Info className="w-4 h-4 mr-2" />
                  What is Malocclusion?
                </button>
                <button
                  onClick={() => setShowOrthodontistFinder(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Find an Orthodontist
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-white/60 rounded-full px-4 py-2 border border-white/40">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentStepData.color}`}></div>
                <span className="text-sm font-medium text-gray-700">{currentStepData.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center relative">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 transform ${
                    isActive 
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110 rotate-3`
                      : isCompleted
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}>
                    {isCompleted ? (
                      <ChevronRight className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center mt-4 space-y-1">
                    <p className={`text-sm font-semibold transition-colors ${
                      isActive ? 'text-gray-800' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 max-w-[120px] leading-tight">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-8 rounded-full transition-all duration-500 ${
                    currentStep > step.number 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="flex justify-center mb-12">
          <div className="w-full animate-fade-in">
            {renderStepContent()}
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex justify-center items-center space-x-6">
          {currentStep > 1 && currentStep < 4 && (
            <button
              onClick={handlePrevious}
              className="flex items-center px-8 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          )}
          
          {currentStep < 3 && (
            <button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className={`flex items-center px-10 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg transform ${
                canProceedToNext()
                  ? `bg-gradient-to-r ${currentStepData.color} text-white hover:shadow-xl hover:-translate-y-1 hover:scale-105`
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
          
          {currentStep === 3 && (
            <button
              onClick={handleNext}
              disabled={isAnalyzing || !canProceedToNext()}
              className={`flex items-center px-12 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg transform ${
                isAnalyzing || !canProceedToNext()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:-translate-y-1 hover:scale-105'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Start Analysis
                </>
              )}
            </button>
          )}
          
          {currentStep === 4 && (
            <button
              onClick={() => {
                setCurrentStep(1);
                setSelectedPhoto(null);
                setDiagnosis('');
                setUserInfo({ age: 0 });
              }}
              className="flex items-center px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-1 hover:scale-105"
            >
              <Camera className="w-5 h-5 mr-2" />
              New Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;