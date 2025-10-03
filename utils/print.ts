interface Question {
  id: number;
  question_text: string;
  question_type: string;
  trait: string | string[];
  category: string;
  weight: number;
  options?: string[];
}

interface Questionnaire {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  questions?: Question[];
}

// Formatting functions for consistent data display
function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    behavioral: "Behavioral",
    hard_skill: "Hard Skill",
    soft_skill: "Soft Skill",
    technical: "Technical",
    personality: "Personality",
  };
  return categoryMap[category] || category;
}

function formatQuestionType(type: string): string {
  const typeMap: Record<string, string> = {
    scale: "Scale (1-5)",
    multiple_choice: "Multiple Choice",
    text: "Text Response",
    yes_no: "Yes/No",
    ranking: "Ranking",
  };
  return typeMap[type] || type;
}

function formatTraits(traits: string | string[]): string {
  if (!traits) return "None";

  const formatSingleTrait = (trait: string): string => {
    return trait
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (typeof traits === "string") return formatSingleTrait(traits);
  if (Array.isArray(traits)) {
    return traits.map(formatSingleTrait).join(", ");
  }
  return "None";
}

function formatWeight(weight: number): string {
  if (weight === 1 || weight === 1.0) return "Standard";
  return `${weight.toFixed(1)}x`;
}

/**
 * Generate and print a questionnaire in a print-friendly format
 */
export function printQuestionnaire(questionnaire: Questionnaire | null) {
  if (!questionnaire) {
    console.warn('Cannot print: questionnaire is null or undefined');
    return;
  }

  // Create a print-friendly version of the questionnaire
  const printContent = `
    <html>
      <head>
        <title>Questionnaire: ${questionnaire.title || 'Untitled'}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.5;
            color: #1f2937;
          }
          h1 { 
            color: #1f2937; 
            margin-bottom: 10px; 
            font-size: 28px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
          }
          h2 { 
            color: #374151; 
            margin-top: 30px; 
            margin-bottom: 15px; 
            font-size: 20px;
          }
          .meta { 
            color: #6b7280; 
            margin-bottom: 30px; 
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
          }
          .meta p { margin: 5px 0; }
          .question { 
            margin-bottom: 25px; 
            padding: 20px; 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            background: #ffffff;
          }
          .question-header { 
            font-weight: bold; 
            margin-bottom: 12px; 
            font-size: 16px;
            color: #1f2937;
          }
          .question-details { 
            color: #6b7280; 
            font-size: 14px; 
            margin-bottom: 12px;
            padding: 8px;
            background: #f3f4f6;
            border-radius: 4px;
          }
          .options { 
            margin-left: 20px; 
            margin-top: 10px;
          }
          .options li { 
            margin-bottom: 8px;
            padding: 4px 0;
          }
          .options-header {
            font-weight: bold;
            margin-bottom: 8px;
            color: #374151;
          }
          @media print {
            body { margin: 0; }
            .question { 
              break-inside: avoid; 
              margin-bottom: 20px;
            }
            h1 { font-size: 24px; }
            h2 { font-size: 18px; }
          }
        </style>
      </head>
      <body>
        <h1>${questionnaire.title || 'Untitled Questionnaire'}</h1>
        <div class="meta">
          <p><strong>Description:</strong> ${questionnaire.description || 'No description provided'}</p>
          <p><strong>Created:</strong> ${questionnaire.created_at ? new Date(questionnaire.created_at).toLocaleDateString() : 'Unknown'}</p>
          <p><strong>Total Questions:</strong> ${questionnaire.questions?.length || 0}</p>
        </div>
        
        <h2>Questions</h2>
        ${questionnaire.questions?.map((question, index) => `
          <div class="question">
            <div class="question-header">${index + 1}. ${question.question_text}</div>
            <div class="question-details">
              <strong>Type:</strong> ${formatQuestionType(question.question_type)} | 
              <strong>Category:</strong> ${formatCategory(question.category)} | 
              <strong>Traits:</strong> ${formatTraits(question.trait)} | 
              <strong>Weight:</strong> ${formatWeight(question.weight)}
            </div>
            ${question.options && question.options.length > 0 ? `
              <div class="options-header">Answer Options:</div>
              <ul class="options">
                ${question.options.map(option => `<li>• ${option}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('') || '<p style="text-align: center; color: #6b7280; font-style: italic;">No questions available</p>'}
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      </body>
    </html>
  `;

  // Open print dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
      // Close window after printing (with a small delay)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    console.error('Failed to open print window. Please check your browser popup settings.');
  }
}

export type { Question, Questionnaire };