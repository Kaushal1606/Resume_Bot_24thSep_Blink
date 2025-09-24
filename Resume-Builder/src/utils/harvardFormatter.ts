import { ResumeContent } from '../../types/resume'

export class HarvardFormatter {
  static formatToHarvardStyle(content: ResumeContent): string {
    const { personalInfo, education, experience, leadership, skills } = content

    let formatted = ''

    // Header - Name in large text (centered)
    formatted += `${personalInfo.fullName}\n\n\n\n\n\n\n\n`

    // Contact information (centered)
    const contactLine = [
      personalInfo.address,
      personalInfo.email,
      personalInfo.phone
    ].filter(Boolean).join(' • ')
    formatted += `${contactLine}\n\n\n`

    // Education Section
    formatted += `Education\n\n`
    education.forEach((edu, index) => {
      formatted += `${edu.institution}\t${edu.location}\n`
      const degreeInfo = [edu.degree, edu.concentration].filter(Boolean).join(', ')
      const gradInfo = edu.gpa ? `${degreeInfo}. GPA ${edu.gpa}` : degreeInfo
      formatted += `${gradInfo}\t${edu.graduationDate}\n`
      
      if (edu.thesis) {
        formatted += `${edu.thesis}\n`
      }
      
      if (edu.coursework && edu.coursework.length > 0) {
        formatted += `Relevant Coursework: ${edu.coursework.join(', ')}\n`
      }
      
      if (edu.honors && edu.honors.length > 0) {
        formatted += `${edu.honors.join(', ')}\n`
      }
      
      if (index < education.length - 1) formatted += `\n`
    })

    formatted += `\n\n\n\n`

    // Experience Section
    formatted += `Experience\n\n`
    experience.forEach((exp, index) => {
      formatted += `${exp.organization}\t${exp.location}\n`
      formatted += `${exp.position}\t${exp.startDate} – ${exp.endDate}\n`
      
      exp.bullets.forEach(bullet => {
        formatted += `${bullet}\n`
      })
      
      if (index < experience.length - 1) formatted += `\n`
    })

    // Leadership & Activities Section
    if (leadership.length > 0) {
      formatted += `\n\nLeadership & Activities\n\n`
      leadership.forEach((activity, index) => {
        formatted += `${activity.organization}\t${activity.location}\n`
        formatted += `${activity.role}\t${activity.startDate} – ${activity.endDate}\n`
        
        if (activity.description && activity.description.length > 0) {
          activity.description.forEach(desc => {
            formatted += `${desc}\n`
          })
        }
        
        if (index < leadership.length - 1) formatted += `\n`
      })
    }

    // Skills & Interests Section
    if (skills.technical?.length || skills.languages?.length || skills.laboratory?.length || skills.interests?.length) {
      formatted += `\n\n\nSkills & Interests\n\n`
      
      if (skills.technical && skills.technical.length > 0) {
        formatted += `Technical: ${skills.technical.join(', ')}\n`
      }
      
      if (skills.languages && skills.languages.length > 0) {
        formatted += `Language: ${skills.languages.join(', ')}\n`
      }
      
      if (skills.laboratory && skills.laboratory.length > 0) {
        formatted += `Laboratory: ${skills.laboratory.join(', ')}\n`
      }
      
      if (skills.interests && skills.interests.length > 0) {
        formatted += `Interests: ${skills.interests.join(', ')}\n`
      }
    }

    return formatted
  }

  static generateHTMLFormat(content: ResumeContent): string {
    const { personalInfo, education, experience, leadership, skills } = content

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${personalInfo.fullName} - Resume</title>
      <style>
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 11pt;
          line-height: 1.2;
          margin: 1in;
          color: #000;
          max-width: 8.5in;
        }
        .header {
          text-align: center;
          margin-bottom: 0.5in;
        }
        .name {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 0.3in;
        }
        .contact {
          font-size: 11pt;
        }
        .section-title {
          font-weight: bold;
          font-size: 11pt;
          margin-top: 0.2in;
          margin-bottom: 0.1in;
          border-bottom: none;
        }
        .entry {
          margin-bottom: 0.15in;
        }
        .entry-header {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
        .entry-subheader {
          display: flex;
          justify-content: space-between;
          font-style: italic;
        }
        .bullet {
          margin-left: 0;
          padding-left: 0;
          list-style: none;
        }
        .bullet li {
          margin-bottom: 0.05in;
        }
        @media print {
          body { margin: 0.75in; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${personalInfo.fullName}</div>
        <div class="contact">${[personalInfo.address, personalInfo.email, personalInfo.phone].filter(Boolean).join(' • ')}</div>
      </div>

      <div class="section">
        <div class="section-title">Education</div>
        ${education.map(edu => `
          <div class="entry">
            <div class="entry-header">
              <span>${edu.institution}</span>
              <span>${edu.location}</span>
            </div>
            <div class="entry-subheader">
              <span>${[edu.degree, edu.concentration].filter(Boolean).join(', ')}${edu.gpa ? `. GPA ${edu.gpa}` : ''}</span>
              <span>${edu.graduationDate}</span>
            </div>
            ${edu.thesis ? `<div>${edu.thesis}</div>` : ''}
            ${edu.coursework && edu.coursework.length > 0 ? `<div>Relevant Coursework: ${edu.coursework.join(', ')}</div>` : ''}
            ${edu.honors && edu.honors.length > 0 ? `<div>${edu.honors.join(', ')}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map(exp => `
          <div class="entry">
            <div class="entry-header">
              <span>${exp.organization}</span>
              <span>${exp.location}</span>
            </div>
            <div class="entry-subheader">
              <span>${exp.position}</span>
              <span>${exp.startDate} – ${exp.endDate}</span>
            </div>
            <ul class="bullet">
              ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      ${leadership.length > 0 ? `
        <div class="section">
          <div class="section-title">Leadership & Activities</div>
          ${leadership.map(activity => `
            <div class="entry">
              <div class="entry-header">
                <span>${activity.organization}</span>
                <span>${activity.location}</span>
              </div>
              <div class="entry-subheader">
                <span>${activity.role}</span>
                <span>${activity.startDate} – ${activity.endDate}</span>
              </div>
              ${activity.description && activity.description.length > 0 ? `
                <ul class="bullet">
                  ${activity.description.map(desc => `<li>${desc}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${(skills.technical?.length || skills.languages?.length || skills.laboratory?.length || skills.interests?.length) ? `
        <div class="section">
          <div class="section-title">Skills & Interests</div>
          <div class="entry">
            ${skills.technical && skills.technical.length > 0 ? `<div><strong>Technical:</strong> ${skills.technical.join(', ')}</div>` : ''}
            ${skills.languages && skills.languages.length > 0 ? `<div><strong>Language:</strong> ${skills.languages.join(', ')}</div>` : ''}
            ${skills.laboratory && skills.laboratory.length > 0 ? `<div><strong>Laboratory:</strong> ${skills.laboratory.join(', ')}</div>` : ''}
            ${skills.interests && skills.interests.length > 0 ? `<div><strong>Interests:</strong> ${skills.interests.join(', ')}</div>` : ''}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
    `
  }
}