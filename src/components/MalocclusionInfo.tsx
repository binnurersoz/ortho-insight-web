
import React from 'react';
import { ArrowLeft, Info, BookOpen, AlertCircle } from 'lucide-react';

interface MalocclusionInfoProps {
  onClose: () => void;
}

const MalocclusionInfo: React.FC<MalocclusionInfoProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center text-white hover:text-white/90 transition-all duration-300 hover:scale-105 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-1">Malocclusion</h1>
            <p className="text-white/80 text-sm">Comprehensive Guide</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-10 space-y-10">
        {/* What is Malocclusion - Hero Section */}
        <div className="space-y-10">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-primary via-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <Info className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-5xl font-extrabold text-foreground tracking-tight">
                What is Malocclusion?
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
              Understanding jaw alignment and its profound impact on your oral health, facial aesthetics, and overall well-being
            </p>
          </div>
          
           {/* Main Classification Section - Side by Side Layout */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-center text-foreground mb-6">
                Classification of Malocclusion
              </h3>
              
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Image Section */}
                <div className="order-2 lg:order-1">
                  <div className="relative overflow-hidden rounded-xl bg-gray-50">
                    <img 
                      src="./lovable-uploads/malocclusion.jpeg" 
                      alt="Classification of Malocclusion showing Class I, II, and III"
                      className="w-[320px] h-auto object-contain shadow-sm rounded-lg mx-auto"
                    />
                  </div>
                </div>

                {/* Classification Cards - Vertical Stack */}
                <div className="order-1 lg:order-2 flex flex-col gap-4 h-full">
                  {/* Class I - Normal Occlusion */}
                  <div className="flex-1 flex flex-col justify-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-bold text-base">I</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-green-800 text-base mb-2">Normal Occlusion</h4>
                        <p className="text-green-700 text-sm leading-relaxed">
                          Jaws are properly aligned, but teeth may be crowded, spaced, or otherwise misaligned. 
                          This is considered the ideal jaw relationship.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Class II */}
                  <div className="flex-1 flex flex-col justify-center bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-bold text-base">II</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-orange-800 text-base mb-2">Class II Malocclusion</h4>
                        <p className="text-orange-700 text-sm leading-relaxed">
                          Lower jaw positioned too far back relative to upper jaw, commonly referred to as "overjet." 
                          Can affect breathing and facial aesthetics.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Class III */}
                  <div className="flex-1 flex flex-col justify-center bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-bold text-base">III</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-800 text-base mb-2">Class III Malocclusion</h4>
                        <p className="text-red-700 text-sm leading-relaxed">
                          Forward displacement of lower jaw. Can only be diagnosed by an Orthodontist with cephalometry device. 
                          Affects chewing and speech functions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>


          {/* Detailed Description */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <BookOpen className="w-7 h-7 mr-3" />
              Understanding Malocclusion
            </h3>
            <div className="space-y-4 text-blue-700 leading-relaxed">
              <p>
                Malocclusion is defined in the literature as incorrect closure of the lower and upper jaws. 
                Some children's jaws and teeth do not develop properly. This results in a closure that is not 
                properly aligned and does not fit well with the teeth in the opposite jaw.
              </p>
              <p>
                However, this can affect the face shape of the individual and the appearance of the teeth, 
                causing shyness, lack of self-confidence and even depression. It can cause serious health 
                problems such as sleep apnea. Severe malocclusions may affect functions such as eating and 
                speaking and may make it difficult to clean the teeth.
              </p>
            </div>
          </div>



          {/* Class II Risks and Early Intervention */}
          <div className="bg-[#E6F2F2] rounded-2xl p-8 border border-teal-200 shadow-md">
            <h3 className="text-2xl font-bold text-teal-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-teal-700" />
              Class II Risks and Early Intervention
            </h3>
            
            <ul className="list-disc pl-6 space-y-3 text-teal-700 leading-relaxed">
              <li>
                <span className="font-semibold">Narrow upper jaw (transverse deficiency): </span>  
                Can cause mouth breathing, higher risk of sleep apnea, digestive problems, and TMJ issues like jaw clicking and jaw pain. 
                If diagnosed early, the palate can be expanded and breathing can improve.

              </li>
              <li>
                <span className="font-semibold">Front open bite: </span>  
                Can lead to difficulty biting or chewing with the front teeth, speech problems, and self-confidence issues. Early age orthodontic intervention can correct habits like thumb sucking or tongue thrust, improving bite and speech.
              </li>
              <li>
                <span className="font-semibold">Long face (vertical growth pattern): </span>  
                May result in mouth breathing, higher risk of dental problems, TMJ issues (jaw clicking and pain), and changes in facial appearance affecting self-confidence. Managing mouth breathing and airway issues at early age can guide proper facial growth.
              </li>
            </ul>
          </div>


            {/* Class 3 – Risks and Early Intervention */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border border-green-200">
                <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-teal-700" />
                  Class III Risks and Early Intervention
                </h3>
                <ul className="list-disc list-inside space-y-3 text-green-700 leading-relaxed">
                  <li>
                    <span className="font-semibold">Lower jaw forward: </span> 
                    Can cause difficulty biting with the front teeth, uneven chewing, jaw strain, and TMJ issues like jaw clicking and pain.
                    Early age treatment with growth modification or orthopedic appliances can guide proper jaw alignment.
                  </li>
                  <li>
                    <span className="font-semibold">Upper and lower teeth misalignment:</span> Can lead to uneven wear on teeth, chewing inefficiency, and jaw discomfort. 
                    Early age intervention with palatal expanders or braces can correct bite and prevent future jaw problems.
                  </li>
                  <li>
                    <span className="font-semibold">Excessive lower jaw growth:</span> May result in mouth breathing, 
                    dental wear, TMJ issues (jaw clicking and pain), and facial aesthetic concerns. Managing the jaw 
                    growth at an early age and guiding jaw development can improve function and appearance.
                  </li>
                </ul>
              </div>


           {/* Global Malocclusion Prevalence Section */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-50 rounded-2xl p-8 border border-pink-100">
              <h3 className="text-2xl font-bold text-pink-800 mb-6">Global Malocclusion Prevalence</h3>
              <ul className="space-y-4 text-pink-700 leading-relaxed list-disc list-inside">
                <li>
                  <span className="font-semibold">Class II Malocclusion (Overbite): </span> 
                  Epidemiological studies indicate that approximately <span className="font-semibold">20–25% of the global population</span> is affected, 
                  representing the highest prevalence among malocclusion types. The condition is more frequently reported in European and American populations, 
                  corresponding to roughly one in four individuals worldwide.
                </li>
                <li>
                  <span className="font-semibold">Class III Malocclusion (Underbite): </span> 
                  Reported in about <span className="font-semibold">1–4% of the global population</span>, making it relatively uncommon. 
                  Higher prevalence is observed in East Asian populations (<span className="font-semibold">4–13%</span>) including China, Korea, and Japan, 
                  whereas Europe and the Americas report lower rates (<span className="font-semibold">1–2%</span>).
                </li>
              </ul>
            </div>


          {/* Treatment Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
            <h3 className="text-2xl font-bold text-purple-800 mb-6">Treatment Options</h3>
            <div className="space-y-4 text-purple-700 leading-relaxed">
              <p>
                While it is possible to treat with orthopedic apparatus in a short time, painless and 
                low-cost at an early age, the only treatment option after the age of 13 is surgical 
                intervention, that is, surgery, which includes a painful recovery process.
              </p>
              <p className="font-semibold">
                For these reasons, early diagnosis by an orthodontist in childhood is important.
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-amber-800 mb-2">Early Detection is Key</p>
                <p className="text-amber-700 leading-relaxed">
                  If you are under 13 years old, please consult an orthodontist as soon as possible 
                  for the most effective and comfortable treatment options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MalocclusionInfo;
