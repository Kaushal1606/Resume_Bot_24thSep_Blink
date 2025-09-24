export interface PersonalInfo {
    fullName: string
    address: string
    email: string
    phone: string
    linkedin?: string
    website?: string
  }
  
  export interface Education {
    institution: string
    degree: string
    concentration?: string
    gpa?: string
    graduationDate: string
    location: string
    thesis?: string
    coursework?: string[]
    honors?: string[]
  }
  
  export interface Experience {
    organization: string
    position: string
    location: string
    startDate: string
    endDate: string
    bullets: string[]
    isRemote?: boolean
  }
  
  export interface LeadershipActivity {
    organization: string
    role: string
    location: string
    startDate: string
    endDate: string
    description?: string[]
  }
  
  export interface Skills {
    technical?: string[]
    languages?: string[]
    laboratory?: string[]
    interests?: string[]
  }
  
  export interface ResumeContent {
    personalInfo: PersonalInfo
    education: Education[]
    experience: Experience[]
    leadership: LeadershipActivity[]
    skills: Skills
  }
  
  export interface Resume {
    id: string
    userId: string
    title: string
    originalContent?: string
    formattedContent?: string
    templateType: 'harvard' | 'stanford'
    atsScore: number
    status: 'draft' | 'processing' | 'completed' | 'error'
    fileUrl?: string
    fileType?: string
    createdAt: string
    updatedAt: string
  }
  
  export interface ResumeVersion {
    id: string
    resumeId: string
    content: string
    changesMade?: string
    versionNumber: number
    createdAt: string
  }
  
  export interface Template {
    id: string
    name: string
    type: string
    stylingConfig: {
      margins: string
      font: string
      fontSize: string
      format: string
    }
    isActive: boolean
  }
  
  export interface ATSAnalysis {
    score: number
    breakdown: {
      contentParsing: number
      keywordRelevance: number
      formatOptimization: number
    }
    suggestions: string[]
  }
  
  export interface JobDescription {
    title: string
    company: string
    content: string
    requirements: string[]
    keywords: string[]
  }