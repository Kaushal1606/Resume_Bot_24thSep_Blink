import React from 'react'
import { ATSAnalysis } from '../types/resume'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { CheckCircle2, AlertTriangle, XCircle, Target, TrendingUp, FileCheck } from 'lucide-react'
import { cn } from '../lib/utils'

interface ATSScoreCardProps {
  analysis: ATSAnalysis
  className?: string
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({
  analysis,
  className = ""
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600' 
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-6 w-6 text-green-600" />
    if (score >= 60) return <AlertTriangle className="h-6 w-6 text-yellow-600" />
    return <XCircle className="h-6 w-6 text-red-600" />
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge variant="destructive">Needs Improvement</Badge>
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          ATS Compatibility Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            {getScoreIcon(analysis.score)}
            <span className={cn("text-4xl font-bold", getScoreColor(analysis.score))}>
              {analysis.score}
            </span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          {getScoreBadge(analysis.score)}
          <Progress value={analysis.score} className="w-full max-w-md mx-auto" />
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Score Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Content Parsing</span>
                <span className="text-xs text-muted-foreground">(40 pts max)</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(analysis.breakdown.contentParsing / 40) * 100} className="w-20" />
                <span className="text-sm font-semibold w-8 text-right">
                  {analysis.breakdown.contentParsing}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Keyword Relevance</span>
                <span className="text-xs text-muted-foreground">(35 pts max)</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(analysis.breakdown.keywordRelevance / 35) * 100} className="w-20" />
                <span className="text-sm font-semibold w-8 text-right">
                  {analysis.breakdown.keywordRelevance}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Format Optimization</span>
                <span className="text-xs text-muted-foreground">(25 pts max)</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(analysis.breakdown.formatOptimization / 25) * 100} className="w-20" />
                <span className="text-sm font-semibold w-8 text-right">
                  {analysis.breakdown.formatOptimization}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Improvement Suggestions
          </h3>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Target Range */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-800">Target ATS Score</span>
          </div>
          <p className="text-sm text-blue-700">
            Aim for a score of <strong>75-80+</strong> to maximize your chances of passing initial ATS screening.
            Most Fortune 500 companies use ATS systems that filter resumes before human review.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}