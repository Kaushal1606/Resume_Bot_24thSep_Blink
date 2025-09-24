import React, { useState } from 'react'
import { ResumeContent, ATSAnalysis, Resume } from '../types/resume'
import { FileUpload } from './FileUpload'
import { ResumePreview } from './ResumePreview'
import { ATSScoreCard } from './ATSScoreCard'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ResumeParser } from '../utils/resumeParser'
import { HarvardFormatter } from '../utils/harvardFormatter'
import { ATSAnalyzer } from '../utils/atsAnalyzer'
import { Download, FileText, Sparkles, Target, Eye, Code } from 'lucide-react'
import { toast } from 'react-hot-toast'
import blink from '../blink/client'

export const ResumeOptimizer: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'optimize' | 'preview'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(null)
  const [originalContent, setOriginalContent] = useState<ResumeContent | null>(null)
  const [atsAnalysis, setATSAnalysis] = useState<ATSAnalysis | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [formattedHTML, setFormattedHTML] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await blink.auth.me()
        setCurrentUser(user)
      } catch (error) {
        // User not authenticated, that's okay for now
      }
    }
    checkAuth()
  }, [])

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    setProcessingProgress(10)

    try {
      // Parse the resume file
      toast.loading('Parsing your resume...', { id: 'processing' })
      const parsedContent = await ResumeParser.parseFromFile(file)
      setOriginalContent(parsedContent)
      setProcessingProgress(40)

      // Enhance with STAR framework
      toast.loading('Enhancing with STAR framework...', { id: 'processing' })
      const enhancedContent = await ResumeParser.enhanceWithSTARFramework(
        parsedContent,
        jobDescription || undefined
      )
      setResumeContent(enhancedContent)
      setProcessingProgress(70)

      // Generate Harvard HTML format
      const htmlFormat = HarvardFormatter.generateHTMLFormat(enhancedContent)
      setFormattedHTML(htmlFormat)
      setProcessingProgress(85)

      // Analyze ATS compatibility
      const analysis = await ATSAnalyzer.analyzeATSCompatibility(
        enhancedContent,
        jobDescription || undefined
      )
      setATSAnalysis(analysis)
      setProcessingProgress(100)

      // Save to database if user is authenticated
      if (currentUser) {
        await blink.db.resumes.create({
          id: `resume_${Date.now()}`,
          userId: currentUser.id,
          title: `Resume - ${new Date().toLocaleDateString()}`,
          originalContent: JSON.stringify(parsedContent),
          formattedContent: JSON.stringify(enhancedContent),
          templateType: 'harvard',
          atsScore: analysis.score,
          status: 'completed',
          fileType: file.type
        })
      }

      toast.success('Resume processed successfully!', { id: 'processing' })
      setStep('optimize')
    } catch (error) {
      console.error('Error processing resume:', error)
      toast.error('Failed to process resume. Please try again.', { id: 'processing' })
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleReoptimize = async () => {
    if (!originalContent) return

    setIsProcessing(true)
    
    try {
      toast.loading('Re-optimizing with job description...', { id: 'reoptimize' })
      
      const enhancedContent = await ResumeParser.enhanceWithSTARFramework(
        originalContent,
        jobDescription
      )
      setResumeContent(enhancedContent)

      const htmlFormat = HarvardFormatter.generateHTMLFormat(enhancedContent)
      setFormattedHTML(htmlFormat)

      const analysis = await ATSAnalyzer.analyzeATSCompatibility(
        enhancedContent,
        jobDescription
      )
      setATSAnalysis(analysis)

      toast.success('Resume re-optimized successfully!', { id: 'reoptimize' })
    } catch (error) {
      console.error('Error re-optimizing resume:', error)
      toast.error('Failed to re-optimize resume', { id: 'reoptimize' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadHTML = () => {
    if (!formattedHTML) return

    const blob = new Blob([formattedHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'harvard-resume.html'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('HTML resume downloaded!')
  }

  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf' })
      
      // Use Blink's screenshot functionality to convert HTML to PDF-like format
      // This is a simple implementation - in production, you'd use a proper PDF library
      const htmlBlob = new Blob([formattedHTML], { type: 'text/html' })
      const htmlUrl = URL.createObjectURL(htmlBlob)
      
      // For now, we'll download the HTML and tell user to save as PDF
      handleDownloadHTML()
      toast.success('Download HTML and save as PDF from your browser', { id: 'pdf' })
      
      URL.revokeObjectURL(htmlUrl)
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF', { id: 'pdf' })
    }
  }

  if (step === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              AI Resume Optimizer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your resume into Harvard Business School format with AI-powered optimization and ATS scoring
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary">Harvard Format</Badge>
              <Badge variant="secondary">STAR Framework</Badge>
              <Badge variant="secondary">ATS Optimized</Badge>
              <Badge variant="secondary">Real-time Analysis</Badge>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description (Optional)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Paste the job description to optimize your resume for specific keywords and requirements
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here for better keyword optimization..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className="w-full"
                />
              </CardContent>
            </Card>

            <FileUpload
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
              processingProgress={processingProgress}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resume Optimizer</h1>
            <p className="text-muted-foreground">Harvard Business School format</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('upload')}>
              <FileText className="h-4 w-4 mr-2" />
              New Resume
            </Button>
            <Button onClick={handleDownloadHTML} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download HTML
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste job description for keyword optimization..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                />
                <Button onClick={handleReoptimize} disabled={isProcessing} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Re-optimizing...' : 'Re-optimize Resume'}
                </Button>
              </CardContent>
            </Card>

            {atsAnalysis && <ATSScoreCard analysis={atsAnalysis} />}
          </div>

          {/* Right Column - Resume Preview */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="html" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  HTML Source
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-6">
                {resumeContent && <ResumePreview content={resumeContent} />}
              </TabsContent>
              
              <TabsContent value="html" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>HTML Source Code</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      HTML formatted resume ready for download or copying
                    </p>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-x-auto max-h-96">
                      <code>{formattedHTML}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}