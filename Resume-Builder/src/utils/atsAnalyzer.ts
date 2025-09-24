import { ResumeContent, ATSAnalysis } from '../../types/resume'
import blink from '../blink/client'

export class ATSAnalyzer {
  static async analyzeATSCompatibility(content: ResumeContent, jobDescription?: string): Promise<ATSAnalysis> {
    try {
      const { object: analysis } = await blink.ai.generateObject({
        prompt: `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide a detailed score breakdown.

        Scoring criteria:
        - Content Parsing (40 points): How well can ATS systems parse the content?
        - Keyword Relevance (35 points): Relevance to job description keywords
        - Format Optimization (25 points): ATS-friendly formatting

        Resume Content:
        ${JSON.stringify(content, null, 2)}

        ${jobDescription ? `Job Description:\n${jobDescription}` : 'No job description provided - focus on general ATS best practices.'}

        Provide specific, actionable suggestions for improvement.`,
        schema: {
          type: 'object',
          properties: {
            score: { type: 'number', minimum: 0, maximum: 100 },
            breakdown: {
              type: 'object',
              properties: {
                contentParsing: { type: 'number', minimum: 0, maximum: 40 },
                keywordRelevance: { type: 'number', minimum: 0, maximum: 35 },
                formatOptimization: { type: 'number', minimum: 0, maximum: 25 }
              },
              required: ['contentParsing', 'keywordRelevance', 'formatOptimization']
            },
            suggestions: {
              type: 'array',
              items: { type: 'string' },
              minItems: 3
            }
          },
          required: ['score', 'breakdown', 'suggestions']
        }
      })

      return analysis as ATSAnalysis
    } catch (error) {
      console.error('Error analyzing ATS compatibility:', error)
      
      // Fallback analysis
      return {
        score: 65,
        breakdown: {
          contentParsing: 25,
          keywordRelevance: 20,
          formatOptimization: 20
        },
        suggestions: [
          'Use standard section headers (Experience, Education, Skills)',
          'Include more relevant keywords from the job description',
          'Ensure consistent date formatting throughout'
        ]
      }
    }
  }

  static getATSFriendlyTips(): string[] {
    return [
      'Use standard section headers: Experience, Education, Skills',
      'Avoid headers, footers, and text boxes',
      'Use simple bullet points, not graphics or special characters',
      'Save in .docx or .pdf format for best compatibility',
      'Use standard fonts like Arial, Calibri, or Times New Roman',
      'Include relevant keywords from the job description',
      'Use consistent date formatting (MM/YYYY)',
      'Avoid tables and columns for main content',
      'Include both acronyms and full terms (e.g., "AI (Artificial Intelligence)")',
      'Use action verbs at the beginning of bullet points'
    ]
  }

  static identifyATSKillers(resumeText: string): string[] {
    const killers: string[] = []
    
    // Check for common ATS issues
    if (resumeText.includes('│') || resumeText.includes('┃')) {
      killers.push('Contains table formatting that may not parse correctly')
    }
    
    if (resumeText.match(/[^\x00-\x7F]/g)) {
      killers.push('Contains special characters that may not be ATS-friendly')
    }
    
    if (resumeText.includes('References available upon request')) {
      killers.push('Avoid "References available upon request" - use space for relevant content')
    }
    
    const dateFormats = resumeText.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/g)
    if (dateFormats && dateFormats.length > 0) {
      killers.push('Use consistent MM/YYYY date format instead of full dates')
    }
    
    return killers
  }
}