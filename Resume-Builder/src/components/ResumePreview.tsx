import React from 'react'
import { ResumeContent } from '../types/resume'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { MapPin, Mail, Phone, Calendar } from 'lucide-react'

interface ResumePreviewProps {
  content: ResumeContent
  className?: string
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  content,
  className = ""
}) => {
  const { personalInfo, education, experience, leadership, skills } = content

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardContent className="p-8">
        <div className="space-y-6 font-serif text-sm leading-tight">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold tracking-wide">{personalInfo.fullName}</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap">
              {personalInfo.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {personalInfo.address}
                </span>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {personalInfo.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {personalInfo.phone}
              </span>
            </div>
          </div>

          <Separator />

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Education</h2>
              {education.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="font-semibold">{edu.institution}</div>
                    <div className="text-sm text-muted-foreground">{edu.location}</div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="italic">
                      {[edu.degree, edu.concentration].filter(Boolean).join(', ')}
                      {edu.gpa && `. GPA ${edu.gpa}`}
                    </div>
                    <div className="text-sm text-muted-foreground">{edu.graduationDate}</div>
                  </div>
                  {edu.thesis && (
                    <div className="text-sm">{edu.thesis}</div>
                  )}
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="text-sm">
                      <strong>Relevant Coursework:</strong> {edu.coursework.join(', ')}
                    </div>
                  )}
                  {edu.honors && edu.honors.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {edu.honors.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Experience</h2>
              {experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="font-semibold">{exp.organization}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="italic">{exp.position}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exp.startDate} – {exp.endDate}
                    </div>
                  </div>
                  <ul className="space-y-1 ml-0">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="text-sm leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Leadership & Activities */}
          {leadership.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Leadership & Activities</h2>
              {leadership.map((activity, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="font-semibold">{activity.organization}</div>
                    <div className="text-sm text-muted-foreground">{activity.location}</div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="italic">{activity.role}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.startDate} – {activity.endDate}
                    </div>
                  </div>
                  {activity.description && activity.description.length > 0 && (
                    <ul className="space-y-1 ml-0">
                      {activity.description.map((desc, descIndex) => (
                        <li key={descIndex} className="text-sm leading-relaxed">
                          {desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills & Interests */}
          {(skills.technical?.length || skills.languages?.length || skills.laboratory?.length || skills.interests?.length) && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Skills & Interests</h2>
              <div className="space-y-2">
                {skills.technical && skills.technical.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <strong className="text-sm">Technical:</strong>
                    <span className="text-sm">{skills.technical.join(', ')}</span>
                  </div>
                )}
                {skills.languages && skills.languages.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <strong className="text-sm">Languages:</strong>
                    <span className="text-sm">{skills.languages.join(', ')}</span>
                  </div>
                )}
                {skills.laboratory && skills.laboratory.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <strong className="text-sm">Laboratory:</strong>
                    <span className="text-sm">{skills.laboratory.join(', ')}</span>
                  </div>
                )}
                {skills.interests && skills.interests.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <strong className="text-sm">Interests:</strong>
                    <span className="text-sm">{skills.interests.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}