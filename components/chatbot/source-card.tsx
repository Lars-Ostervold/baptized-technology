import { 
  Book, 
  Podcast, 
  Video, 
  FileText, 
  Link as LinkIcon, 
  BookOpen, 
  Newspaper, 
  MessageSquare, 
  Globe, 
  Mic, 
  ScrollText 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Source } from '@/lib/chatbot/types';

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  // Choose icon based on source type
  const getSourceIcon = () => {

    const type = source.type;
    
    switch(type) {
      case 'book':
        return <Book className="h-4 w-4" />;
      case 'podcast':
        return <Podcast className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'bible':
        return <BookOpen className="h-4 w-4" />;
      case 'article':
        return <Newspaper className="h-4 w-4" />;
      case 'blog':
        return <MessageSquare className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      case 'speech':
        return <Mic className="h-4 w-4" />;
      case 'research_paper':
        return <ScrollText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  // Helper function to format timestamps
  const formatTimestamp = (timestamp: string | number): string => {
    if (typeof timestamp === 'number') {
      // If timestamp is a number of seconds, format as MM:SS
      const minutes = Math.floor(timestamp / 60);
      const seconds = timestamp % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (typeof timestamp === 'string') {
      // If timestamp is already a string in HH:MM:SS or MM:SS format, use it directly
      // Validate it matches expected format
      if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timestamp)) {
        return timestamp;
      } else {
        // If string but in unexpected format, return as-is
        return timestamp;
      }
    }
    
    // Fallback for unexpected types
    return String(timestamp);
  };
  
  // Format metadata for display
  const formatMetadata = () => {
    if (!source.metadata) return null;
    
    const type = source.type;
    const details = [];
    
    // Common fields that might appear in multiple types
    if (source.metadata.author) details.push(`By ${source.metadata.author}`);
    
    // Type-specific metadata formatting
    switch(type) {
      case 'book':
        if (source.metadata.publisher) details.push(source.metadata.publisher);
        if (source.metadata.publication_year) details.push(`(${source.metadata.publication_year})`);
        if (source.metadata.page) details.push(`Page: ${source.metadata.page}`);
        if (source.metadata.isbn) details.push(`ISBN: ${source.metadata.isbn}`);
        break;
        
      case 'podcast':
        if (source.metadata.episode_title) details.push(`"${source.metadata.episode_title}"`);
        if (source.metadata.episode_number) details.push(`Episode ${source.metadata.episode_number}`);
        if (source.metadata.timestamp) {
          details.push(`Timestamp: ${formatTimestamp(source.metadata.timestamp)}`);
        }
        break;
        
      case 'article':
        if (source.metadata.publication_date) {
          const date = new Date(source.metadata.publication_date);
          details.push(date.toLocaleDateString());
        }
        break;
        
      case 'video':
        if (source.metadata.platform) details.push(source.metadata.platform);
        if (source.metadata.timestamp) {
          details.push(`Timestamp: ${formatTimestamp(source.metadata.timestamp)}`);
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
        // Most website information will be shown in the URL link
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
    <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
      <CardContent className="p-3 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {getSourceIcon()}
          <span className="text-sm font-medium">{source.title}</span>
        </div>
        {formatMetadata() && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatMetadata()}
          </p>
        )}
        {source.url && (
          <a 
            href={source.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1"
          >
            <LinkIcon size={12} /> View source
          </a>
        )}
      </CardContent>
    </Card>
  );
}