
import React from 'react';
import { AlertCircle, User2, Activity, Info, Award, Heart, Brain } from 'lucide-react';

interface DiagnosisResultsProps {
  diagnosis: string;
  confidence?: number;
  userInfo: {
    age: number;
  };
}

const DiagnosisResults: React.FC<DiagnosisResultsProps> = ({ 
  diagnosis, 
  confidence = 0,
  userInfo 
}) => {
  const getClassColor = (diagnosis: string) => {
    switch (diagnosis.toLowerCase()) {
      case 'class i':
        return 'from-green-400 to-emerald-500';
      case 'class ii':
        return 'from-orange-400 to-red-500';
      case 'class iii':
        return 'from-red-400 to-pink-500';
      default:
        return 'from-blue-400 to-purple-500';
    }
  };

  const getDiagnosisInfo = (diagnosis: string): {
    title: string;
    description: string;
    recommendations: string[];
    risks?: string[];
  } => {
    switch (diagnosis.toLowerCase()) {
      case 'class i':
        return {
          title: 'Normal Occlusion',
          description: 'Your bite alignment appears to be within normal limits. Continue maintaining good oral hygiene.',
          recommendations: [
            'Maintain good oral hygiene',
            'Get dental checkups every 6 months',
            'Continue current oral care routine'
          ]
        };
      case 'class ii':
        return {
          title: 'Class II Malocclusion',
          description: 'Upper jaw is positioned forward relative to the lower jaw (overbite condition).',
          recommendations: [
            'Consult an orthodontist',
            'Early intervention may be beneficial',
            'Braces or clear aligners may be considered'
          ],
          risks: [
            'Narrow upper jaw (transverse deficiency): Can cause mouth breathing, higher risk of sleep apnea, digestive problems, and TMJ issues like jaw clicking and jaw pain. If diagnosed early, the palate can be expanded and breathing can improve.',
            'Front open bite: Can lead to difficulty biting or chewing with the front teeth, speech problems, and self-confidence issues. Early age orthodontic intervention can correct habits like thumb sucking or tongue thrust, improving bite and speech.',
            'Long face (vertical growth pattern): May result in mouth breathing, higher risk of dental problems, TMJ issues (jaw clicking and pain), and changes in facial appearance affecting self-confidence. Managing mouth breathing and airway issues at early age can guide proper facial growth.'
          ]
        };
      case 'class iii':
        return {
          title: 'Class III Malocclusion',
          description: 'Lower jaw is positioned forward relative to the upper jaw (underbite condition).',
          recommendations: [
            'Urgent orthodontic consultation recommended',
            'Combined orthodontic-surgical treatment may be needed',
            'Early treatment planning is important'
          ],
          risks: [
            'Lower jaw forward: Can cause difficulty biting with the front teeth, uneven chewing, jaw strain, and TMJ issues like jaw clicking and pain. Early age treatment with growth modification or orthopedic appliances can guide proper jaw alignment.',
            'Upper and lower teeth misalignment: Can lead to uneven wear on teeth, chewing inefficiency, and jaw discomfort. Early age intervention with palatal expanders or braces can correct bite and prevent future jaw problems.',
            'Excessive lower jaw growth: May result in mouth breathing, dental wear, TMJ issues (jaw clicking and pain), and facial aesthetic concerns. Managing the jaw growth early age and guiding jaw development can improve function and appearance.'
          ]
        };
      default:
        return {
          title: 'Analysis Complete',
          description: 'Your orthodontic analysis has been completed.',
          recommendations: ['Consult a specialist for detailed evaluation']
        };
    }
  };

  const getAgeImpact = (age: number) => {
    if (age < 18) {
      return "For patients under 18, growth patterns should be monitored as they may affect treatment planning and duration.";
    } else if (age > 50) {
      return "Adult treatment may take longer but is still highly effective with proper care.";
    }
    
    return "Your age is within an optimal range for orthodontic treatment.";
  };

  const diagnosisInfo = getDiagnosisInfo(diagnosis);
  const gradientClass = getClassColor(diagnosis);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Analysis Results
        </h2>
        <p className="text-gray-600 text-lg">Orthodontic evaluation report</p>
      </div>

      {/* Main Diagnosis Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${gradientClass}`}></div>
        <div className="p-10">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r ${gradientClass} text-white mb-6 shadow-lg`}>
              <Brain className="w-8 h-8 mr-3" />
              <span className="text-3xl font-bold">{diagnosis.toUpperCase()}</span>
            </div>
            
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Info className="w-6 h-6 mr-3 text-blue-500" />
                {diagnosisInfo.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {diagnosisInfo.description}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-6 text-lg flex items-center">
                <Heart className="w-6 h-6 mr-3" />
                Recommendations and Treatment Options
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diagnosisInfo.recommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-blue-800 text-sm font-medium leading-relaxed">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Risks Section */}
            {diagnosisInfo.risks && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                <h4 className="font-bold text-red-900 mb-6 text-lg flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3" />
                  Health Risks and Complications
                </h4>
                <div className="space-y-4">
                  {diagnosisInfo.risks.map((risk, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-red-800 text-sm font-medium leading-relaxed">{risk}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information Impact */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <User2 className="w-7 h-7 mr-3 text-purple-500" />
          Personal Health Assessment
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h4 className="font-bold text-purple-900 mb-4 flex items-center text-lg">
              <Activity className="w-5 h-5 mr-2" />
              Your Profile
            </h4>
            <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-purple-600">{userInfo.age}</p>
              <p className="text-lg text-gray-600 font-medium">Years Old</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h4 className="font-bold text-green-900 mb-4 flex items-center text-lg">
              <Info className="w-5 h-5 mr-2" />
              Age Considerations
            </h4>
            <div className="bg-white rounded-xl p-4 border border-green-100">
              <p className="text-green-800 leading-relaxed">
                {getAgeImpact(userInfo.age)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-8">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-amber-800 mb-3 text-lg">Important Notice</p>
            <p className="text-amber-700 leading-relaxed">
              This analysis is for preliminary assessment purposes and does not replace professional medical advice. 
              Please consult a qualified orthodontist for comprehensive evaluation and treatment planning. 
              If you are under 13 years old, please consult an orthodontist as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResults;