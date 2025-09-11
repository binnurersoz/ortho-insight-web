export interface ApiResponse {
  result: string;
  confidence?: number;
}

export interface ValidationResponse {
  result: string;
  message?: string;
}

export class OrthodontistApi {
  private static baseUrl = 'https://tmp.kedi-mobile.com';
  
  static async validatePosture(image: File): Promise<ValidationResponse> {
    const formData = new FormData();
    formData.append('image', image);
    
    try {
      console.log('🔍 Validating posture with AWS backend:', this.baseUrl);
      console.log('📤 Sending request to:', `${this.baseUrl}/validate`);
      
      const response = await fetch(`${this.baseUrl}/validate`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ AWS Backend Error:', errorText);
        throw new Error(`AWS Backend Error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.text();
      console.log('✅ Raw API response:', result);
      
      let resultCode: number;
      try {
        // Try to parse as JSON first (new format)
        const jsonResult = JSON.parse(result);
        if (jsonResult.Result !== undefined) {
          resultCode = parseInt(jsonResult.Result);
          console.log('🔢 Parsed result code from JSON:', resultCode);
        } else {
          throw new Error('No Result field in JSON');
        }
      } catch (jsonError) {
        // Fallback to old string format
        const cleanResult = result.replace(/['"]/g, '');
        console.log('🧹 Cleaned result (fallback):', cleanResult);
        resultCode = parseInt(cleanResult);
        console.log('🔢 Parsed result code (fallback):', resultCode);
      }
      
      switch (resultCode) {
        case 0:
          console.log('✅ Validation successful: Correct side face posture');
          return { result: 'valid', message: 'Correct side face posture detected' };
        case 1:
          console.log('⚠️ Validation failed: Wrong posture');
          return { result: 'invalid', message: 'Wrong posture detected' };
        case 2:
          console.log('⚠️ Validation failed: Left side face detected');
          return { result: 'invalid', message: 'Left side face detected - please use right side face' };
        default:
          console.error('❌ Unknown validation result code:', resultCode);
          console.error('❌ Original response:', result);
          return { result: 'invalid', message: `Unknown validation result: ${resultCode}. Please try again.` };
      }
    } catch (error) {
      console.error('💥 AWS Backend Connection Error:', error);
      if (error instanceof Error) {
        throw new Error(`AWS Backend Connection Failed: ${error.message}`);
      }
      throw new Error('AWS Backend Connection Failed: Unknown error');
    }
  }
  
  static async analyzeClassIII(image: File, age: number): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('image', image);
    
    const endpoint = age >= 14 ? '/kedi_api_adult' : '/kedi_api';
    
    try {
      console.log('🔍 Analyzing Class III with endpoint:', endpoint);
      console.log('📤 Sending request to:', `${this.baseUrl}${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}?left_side_face=false`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('📥 Class III Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Class III Analysis Error:', errorText);
        throw new Error(`Class III Analysis Failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.text();
      console.log('✅ Class III Raw response:', result);
      
      let resultCode: number;
      try {
        // Parse JSON response
        const jsonResult = JSON.parse(result);
        resultCode = parseInt(jsonResult.Result);
        console.log('🔢 Class III Result code:', resultCode);
      } catch (jsonError) {
        // Fallback to old string format
        const cleanResult = result.replace(/['"]/g, '');
        resultCode = parseInt(cleanResult);
        console.log('🔢 Class III Result code (fallback):', resultCode);
      }
      
      return {
        result: resultCode === 1 ? 'Class III' : 'Not Class III',
        confidence: 0.85
      };
    } catch (error) {
      console.error('💥 Class III Analysis Error:', error);
      throw error;
    }
  }
  
  static async analyzeClassII(image: File, age: number): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('image', image);
    
    const endpoint = age >= 14 ? '/kedi_api_2_adult' : '/kedi_api_2';
    
    try {
      console.log('🔍 Analyzing Class II with endpoint:', endpoint);
      console.log('📤 Sending request to:', `${this.baseUrl}${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}?left_side_face=false`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('📥 Class II Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Class II Analysis Error:', errorText);
        throw new Error(`Class II Analysis Failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.text();
      console.log('✅ Class II Raw response:', result);
      
      let resultCode: number;
      try {
        // Parse JSON response
        const jsonResult = JSON.parse(result);
        resultCode = parseInt(jsonResult.Result);
        console.log('🔢 Class II Result code:', resultCode);
      } catch (jsonError) {
        // Fallback to old string format
        const cleanResult = result.replace(/['"]/g, '');
        resultCode = parseInt(cleanResult);
        console.log('🔢 Class II Result code (fallback):', resultCode);
      }
      
      return {
        result: resultCode === 1 ? 'Class II' : 'Class I',
        confidence: 0.85
      };
    } catch (error) {
      console.error('💥 Class II Analysis Error:', error);
      throw error;
    }
  }
  
  static async performComprehensiveAnalysis(image: File, age: number): Promise<string> {
    try {
      console.log('🚀 Starting comprehensive analysis for age:', age);
      
      // First validate the posture
      const validation = await this.validatePosture(image);
      if (validation.result === 'invalid') {
        throw new Error(validation.message || 'Invalid photo posture');
      }
      
      // Analyze Class III vs Not Class III
      const classIIIResult = await this.analyzeClassIII(image, age);
      
      if (classIIIResult.result === 'Class III') {
        console.log('🎯 Final result: Class III');
        return 'Class III';
      }
      
      // If not Class III, analyze Class II vs Class I
      const classIIResult = await this.analyzeClassII(image, age);
      console.log('🎯 Final result:', classIIResult.result);
      return classIIResult.result;
      
    } catch (error) {
      console.error('💥 Comprehensive analysis error:', error);
      throw error;
    }
  }
}