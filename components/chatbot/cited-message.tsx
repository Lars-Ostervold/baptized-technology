import React from 'react';
import Link from 'next/link';
import { Source } from '@/lib/chatbot/types';

interface CitedMessageProps {
  content: string;
  sources: Source[];
}

export function CitedMessage({ content, sources }: CitedMessageProps) {
  if (!sources || sources.length === 0) {
    // If no sources, just return the plain content
    return (
      <div>
        {content.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {line || "\u00A0"}
          </p>
        ))}
      </div>
    );
  }

  // Regex to match citation patterns [1], [2], etc.
  const regex = /\[(\d+)\]/g;
  
  // Split content by citation markers and create React elements
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let matches = false;
  
  // Create a copy of content for processing
  const contentCopy = content;
  
  while ((match = regex.exec(contentCopy)) !== null) {
    matches = true;
    // Add text before the citation
    if (match.index > lastIndex) {
      const textPart = contentCopy.substring(lastIndex, match.index);
      parts.push(
        <React.Fragment key={`text-${lastIndex}`}>
          {textPart}
        </React.Fragment>
      );
    }
    
    // Add the citation as a link
    const sourceNumber = parseInt(match[1], 10);
    if (sourceNumber >= 1 && sourceNumber <= sources.length) {
      // Adjust index to 0-based
      const sourceIndex = sourceNumber - 1;
      const source = sources[sourceIndex];
      
      parts.push(
        <a
          key={`citation-${match.index}`}
          href={source.url || '#'}
          title={source.title}
          className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[0]}
        </a>
      );
    } else {
      // If citation number is out of range, just add the text
      parts.push(
        <React.Fragment key={`invalid-citation-${match.index}`}>
          {match[0]}
        </React.Fragment>
      );
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < contentCopy.length) {
    parts.push(
      <React.Fragment key={`text-end`}>
        {contentCopy.substring(lastIndex)}
      </React.Fragment>
    );
  }

  // If no citations were found, return the original content
  if (!matches) {
    return (
      <div>
        {content.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {line || "\u00A0"}
          </p>
        ))}
      </div>
    );
  }

  // Transform parts to respect newlines
  const result: React.ReactNode[] = [];
  let currentParagraph: React.ReactNode[] = [];
  
  parts.forEach((part, index) => {
    if (typeof part === 'string') {
      const lines = part.split('\n');
      lines.forEach((line, lineIndex) => {
        if (lineIndex > 0) {
          // End previous paragraph
          result.push(<p key={`p-${index}-${lineIndex-1}`}>{currentParagraph}</p>);
          currentParagraph = [line];
        } else {
          currentParagraph.push(line);
        }
      });
    } else {
      currentParagraph.push(part);
    }
  });
  
  // Add the last paragraph
  if (currentParagraph.length > 0) {
    result.push(<p key="p-last">{currentParagraph}</p>);
  }
  
  return <div className="space-y-2">{result}</div>;
} 