import React from 'react';
import Link from 'next/link';
import { Source } from '@/lib/chatbot/types';
import { cn } from '@/lib/utils';

interface CitedMessageProps {
  content: string;
  sources: Source[];
}

// Helper function to handle markdown-style text
function formatMarkdownText(text: string): React.ReactNode {
  // Process bold text (**text**)
  const parts: React.ReactNode[] = [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the bold part
    parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
}

export function CitedMessage({ content, sources }: CitedMessageProps) {
  if (!sources || sources.length === 0) {
    // If no sources, just return the plain content with markdown formatting
    return (
      <div>
        {content.split('\n').map((line, i) => {
          // Check if this is a header
          const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
          if (headerMatch) {
            const level = headerMatch[1].length; // Number of # symbols
            const headerText = headerMatch[2];
            
            const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
            return <HeaderTag key={i} className="font-bold mt-6 mb-4">{formatMarkdownText(headerText)}</HeaderTag>;
          }
          
          return (
            <p key={i} className={cn(
              "leading-relaxed",
              i > 0 ? "mt-4" : "",
              line.trim() === "" ? "h-4" : ""
            )}>
              {formatMarkdownText(line) || "\u00A0"}
            </p>
          );
        })}
      </div>
    );
  }

  // Regex to match citation patterns [1], [2], etc.
  const regex = /\[(\d+)\]/g;
  
  // Move citations outside punctuation (period, comma, semicolon, colon, exclamation, question mark)
  // This handles cases where citations appear before punctuation
  let processedContent = content.replace(/(\[(?:\d+)\](?:\s*\[(?:\d+)\])*)\s*([.,;:!?])/g, (match, citations, punctuation) => {
    return `${punctuation}${citations}`;
  });
  
  // Handle cases where citations appear after punctuation (shouldn't need to change these)
  // but we still keep this for completeness
  processedContent = processedContent.replace(/([.,;:!?])\s*(\[(?:\d+)\](?:\s*\[(?:\d+)\])*)/g, (match, punctuation, citations) => {
    return `${punctuation}${citations}`;
  });
  
  // Split content by citation markers and create React elements
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let matches = false;
  let prevWasCitation = false;
  
  // Create a copy of content for processing
  const contentCopy = processedContent;
  
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
      prevWasCitation = false;
    }
    
    // Add comma if this is a consecutive citation
    if (prevWasCitation) {
      parts.push(
        <span 
          key={`comma-${match.index}`}
          className="inline-block text-[0.7em] align-super relative top-[-0.3em]"
        >
          ,
        </span>
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
          className="inline-block text-[0.7em] align-super relative top-[-0.3em] text-blue-600/70 dark:text-blue-400/70 hover:underline decoration-blue-400/30 dark:decoration-blue-500/30 decoration-dotted underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400 hover:decoration-blue-500/60 dark:hover:decoration-blue-400/60"
          target="_blank"
          rel="noopener noreferrer"
        >
          {sourceNumber}
        </a>
      );
      prevWasCitation = true;
    } else {
      // If citation number is out of range, just add the text
      parts.push(
        <React.Fragment key={`invalid-citation-${match.index}`}>
          {match[0]}
        </React.Fragment>
      );
      prevWasCitation = false;
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
        {content.split('\n').map((line, i) => {
          // Check if this is a header
          const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
          if (headerMatch) {
            const level = headerMatch[1].length; // Number of # symbols
            const headerText = headerMatch[2];
            
            const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
            return <HeaderTag key={i} className="font-bold mt-6 mb-4">{formatMarkdownText(headerText)}</HeaderTag>;
          }
          
          return (
            <p key={i} className={cn(
              "leading-relaxed",
              i > 0 ? "mt-4" : "",
              line.trim() === "" ? "h-4" : ""
            )}>
              {formatMarkdownText(line) || "\u00A0"}
            </p>
          );
        })}
      </div>
    );
  }

  // Process parts to handle line breaks and formatting
  const paragraphs: React.ReactNode[] = [];
  let currentParagraphParts: React.ReactNode[] = [];
  
  parts.forEach((part, index) => {
    if (React.isValidElement(part) && part.type === React.Fragment) {
      const text = part.props.children as string;
      if (typeof text === 'string') {
        const lines = text.split('\n');
        
        lines.forEach((line, lineIndex) => {
          // Check if the line is a header
          const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
          if (headerMatch) {
            // If we have existing content, add it as a paragraph first
            if (currentParagraphParts.length > 0) {
              paragraphs.push(
                <p key={`p-${index}-${lineIndex}`} className="leading-relaxed">
                  {currentParagraphParts.map((part, i) => {
                    if (React.isValidElement(part) && part.type === React.Fragment) {
                      return formatMarkdownText(part.props.children as string);
                    }
                    return part;
                  })}
                </p>
              );
              currentParagraphParts = [];
            }
            
            // Add the header
            const level = headerMatch[1].length;
            const headerText = headerMatch[2];
            
            const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
            paragraphs.push(
              <HeaderTag key={`h-${index}-${lineIndex}`} className="font-bold mt-6 mb-4">
                {formatMarkdownText(headerText)}
              </HeaderTag>
            );
          } else if (line.trim() === '') {
            // Handle empty lines - add current paragraph if exists
            if (currentParagraphParts.length > 0) {
              paragraphs.push(
                <p key={`p-${index}-${lineIndex}`} className="leading-relaxed">
                  {currentParagraphParts.map((part, i) => {
                    if (React.isValidElement(part) && part.type === React.Fragment) {
                      return formatMarkdownText(part.props.children as string);
                    }
                    return part;
                  })}
                </p>
              );
              currentParagraphParts = [];
            }
            // Add empty line spacing
            paragraphs.push(<div key={`empty-${index}-${lineIndex}`} className="h-4" />);
          } else {
            // Add to current paragraph
            currentParagraphParts.push(
              <React.Fragment key={`line-${index}-${lineIndex}`}>
                {line}
              </React.Fragment>
            );
          }
        });
      } else {
        currentParagraphParts.push(part);
      }
    } else {
      // For non-fragment elements like citations
      currentParagraphParts.push(part);
    }
  });
  
  // Add the last paragraph if there's anything left
  if (currentParagraphParts.length > 0) {
    paragraphs.push(
      <p key="last-paragraph" className="leading-relaxed">
        {currentParagraphParts.map((part, i) => {
          if (React.isValidElement(part) && part.type === React.Fragment) {
            return formatMarkdownText(part.props.children as string);
          }
          return part;
        })}
      </p>
    );
  }
  
  return <div>{paragraphs}</div>;
} 