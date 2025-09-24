import { ResumeContent, PersonalInfo, Education, Experience, LeadershipActivity, Skills } from '../types/resume'
import blink from '../blink/client'

export class ResumeParser {
  static async parseFromFile(file: File): Promise<ResumeContent> {
    try {
      // Upload file to Blink storage first
      const { publicUrl } = await blink.storage.upload(
        file,
        `resumes/original/${Date.now()}.${file.name.split('.').pop()}`,
        { upsert: true }
      )

      // Extract text content using Blink data extraction
      const extractedText = await blink.data.extractFromUrl(publicUrl)
      
      // Parse the extracted text using AI
      const { object: parsedContent } = await blink.ai.generateObject({
        prompt: `Parse this resume text and extract structured information. Use the EXACT format provided in the schema. Extract all personal information, education details, work experience, leadership activities, and skills. Maintain all original content and dates.

Resume text:
${extractedText}`,
        schema: {
          type: 'object',
          properties: {
            personalInfo: {
              type: 'object',
              properties: {
                fullName: { type: 'string' },
                address: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                linkedin: { type: 'string' },
                website: { type: 'string' }
              },
              required: ['fullName', 'email']
            },
            education: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  institution: { type: 'string' },
                  degree: { type: 'string' },
                  concentration: { type: 'string' },
                  gpa: { type: 'string' },
                  graduationDate: { type: 'string' },
                  location: { type: 'string' },
                  thesis: { type: 'string' },
                  coursework: { type: 'array', items: { type: 'string' } },
                  honors: { type: 'array', items: { type: 'string' } }
                },
                required: ['institution', 'degree', 'graduationDate', 'location']
              }
            },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  organization: { type: 'string' },
                  position: { type: 'string' },
                  location: { type: 'string' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                  bullets: { type: 'array', items: { type: 'string' } },
                  isRemote: { type: 'boolean' }
                },
                required: ['organization', 'position', 'location', 'startDate', 'endDate', 'bullets']
              }
            },
            leadership: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  organization: { type: 'string' },
                  role: { type: 'string' },
                  location: { type: 'string' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                  description: { type: 'array', items: { type: 'string' } }
                },
                required: ['organization', 'role', 'location', 'startDate', 'endDate']
              }
            },
            skills: {
              type: 'object',
              properties: {
                technical: { type: 'array', items: { type: 'string' } },
                languages: { type: 'array', items: { type: 'string' } },
                laboratory: { type: 'array', items: { type: 'string' } },
                interests: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          required: ['personalInfo', 'education', 'experience', 'leadership', 'skills']
        }
      })

      return parsedContent as ResumeContent
    } catch (error) {
      console.error('Error parsing resume:', error)
      throw new Error('Failed to parse resume file')
    }
  }

  static async enhanceWithSTARFramework(content: ResumeContent, jobDescription?: string): Promise<ResumeContent> {
    try {
      const { object: enhancedContent } = await blink.ai.generateObject({
        prompt: `Transform the experience bullet points using the STAR framework (Situation, Task, Action, Result). 
        
        Guidelines:
        - Rewrite each bullet point to follow STAR structure
        - Start with strong action verbs
        - Include quantifiable results where possible
        - Maintain professional tone and authenticity
        - Keep original achievements and responsibilities
        - Add relevant keywords if job description is provided
        
        ${jobDescription ? `Job Description for context:\n${jobDescription}` : ''}
        
        Current resume content:
        ${JSON.stringify(content, null, 2)}`,
        schema: {
          type: 'object',
          properties: {
            personalInfo: {
              type: 'object',
              properties: {
                fullName: { type: 'string' },
                address: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                linkedin: { type: 'string' },
                website: { type: 'string' }
              }
            },
            education: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  institution: { type: 'string' },
                  degree: { type: 'string' },
                  concentration: { type: 'string' },
                  gpa: { type: 'string' },
                  graduationDate: { type: 'string' },
                  location: { type: 'string' },
                  thesis: { type: 'string' },
                  coursework: { type: 'array', items: { type: 'string' } },
                  honors: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  organization: { type: 'string' },
                  position: { type: 'string' },
                  location: { type: 'string' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                  bullets: { type: 'array', items: { type: 'string' } },
                  isRemote: { type: 'boolean' }
                }
              }
            },
            leadership: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  organization: { type: 'string' },
                  role: { type: 'string' },
                  location: { type: 'string' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                  description: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            skills: {
              type: 'object',
              properties: {
                technical: { type: 'array', items: { type: 'string' } },
                languages: { type: 'array', items: { type: 'string' } },
                laboratory: { type: 'array', items: { type: 'string' } },
                interests: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      })

      return enhancedContent as ResumeContent
    } catch (error) {
      console.error('Error enhancing resume:', error)
      return content // Return original if enhancement fails
    }
  }
}