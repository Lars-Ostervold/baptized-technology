import { Card, CardContent } from '@/components/ui/card';
import type { Source } from '@/lib/chatbot/types';
import { UrlMetadata } from './url-metadata';

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  // Helper function to format timestamps
  const formatTimestamp = (timestamp: string | number): string => {
    if (typeof timestamp === 'number') {
      const minutes = Math.floor(timestamp / 60);
      const seconds = timestamp % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (typeof timestamp === 'string') {
      if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timestamp)) {
        return timestamp;
      } else {
        return timestamp;
      }
    }
    return String(timestamp);
  };
  
  // Format metadata for display
  const formatMetadata = () => {
    if (!source.metadata) return null;
    
    const type = source.type;
    const details = [];
    
    // Add content type as first piece of information
    const formatType = (type: string) => {
      return type.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    
    details.push(formatType(type));
    
    // Common fields that might appear in multiple types
    if (source.metadata.author) details.push(`By ${source.metadata.author}`);
    
    // Type-specific metadata formatting
    switch(type) {
      case 'book':
        if (source.metadata.publisher) details.push(source.metadata.publisher);
        if (source.metadata.publication_year) details.push(`(${source.metadata.publication_year})`);
        if (source.metadata.page) details.push(`Page ${source.metadata.page}`);
        if (source.metadata.isbn) details.push(`ISBN: ${source.metadata.isbn}`);
        break;
        
      case 'podcast':
        if (source.metadata.episode_number) details.push(`${source.metadata.episode_number}`);
        if (source.metadata.timestamp) {
          details.push(`Timestamp for Source: ${formatTimestamp(source.metadata.timestamp)}`);
        }
        break;
        
      case 'article':
        if (source.metadata.page) details.push(`Page ${source.metadata.page}`);
        if (source.metadata.publication_date) {
          const date = new Date(source.metadata.publication_date);
          details.push(date.toLocaleDateString());
        }
        break;
        
      case 'video':
        if (source.metadata.platform) details.push(source.metadata.platform);
        if (source.metadata.timestamp) {
          details.push(`Timestamp for Source: ${formatTimestamp(source.metadata.timestamp)}`);
        }
        break;
        
      case 'speech':
        if (source.metadata.speaker) details.push(`Speaker: ${source.metadata.speaker}`);
        if (source.metadata.speech_date) {
          const date = new Date(source.metadata.speech_date);
          details.push(date.toLocaleDateString());
        }
        break;
        
      case 'research_paper':
        if (source.metadata.journal_name) details.push(source.metadata.journal_name);
        if (source.metadata.publication_year) details.push(`(${source.metadata.publication_year})`);
        if (source.metadata.doi) details.push(`DOI: ${source.metadata.doi}`);
        break;
        
      case 'blog':
        if (source.metadata.publication_date) {
          const date = new Date(source.metadata.publication_date);
          details.push(date.toLocaleDateString());
        }
        break;
        
      case 'website':
        break;
        
      case 'bible':
        const { book, chapter, verse, translation } = source.metadata;
        if (book && chapter && verse) {
          details.push(`${book} ${chapter}:${verse}`);
        }
        if (translation) details.push(translation);
        break;
    }
    
    return details.join(' · ');
  };

  return (
    <Card 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-sm rounded-lg"
      onClick={() => source.url && window.open(source.url, '_blank', 'noopener,noreferrer')}
    >
      <CardContent className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-shrink-0 flex items-center justify-center text-slate-700 dark:text-slate-300">
            {source.url ? (
              <UrlMetadata url={source.url} type={source.type} />
            ) : (
              <UrlMetadata url="" type={source.type} />
            )}
          </div>
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <span className="text-sm font-medium line-clamp-2">{source.title}</span>
            {formatMetadata() && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {formatMetadata()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}