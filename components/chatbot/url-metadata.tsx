import { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Book, 
  Podcast, 
  Video, 
  FileText, 
  BookOpen, 
  FileTextIcon,
  ScrollText,
  MessageSquare, 
  Globe, 
  Mic 
} from 'lucide-react';

interface UrlMetadataProps {
  url: string;
  type: string;
  className?: string;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export function UrlMetadata({ url, type, className }: UrlMetadataProps) {
  const [favicon, setFavicon] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        if (!url) {
          setHasError(true);
          return;
        }

        // Check if URL is a PDF - return early as we'll show the article icon
        if (url.toLowerCase().endsWith('.pdf')) {
          setIsLoading(false);
          return;
        }

        // Extract domain from URL
        const domain = new URL(url).hostname;
        
        // Try to get favicon first
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        setFavicon(faviconUrl);

        // Try to get OpenGraph image
        const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.ogImage) {
          setOgImage(data.ogImage);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  // Fallback to type-based icon if no favicon/ogImage is available
  const getFallbackIcon = () => {
    switch(type) {
      case 'book': return <Book className="h-8 w-8" />;
      case 'podcast': return <Podcast className="h-8 w-8" />;
      case 'video': return <Video className="h-8 w-8" />;
      case 'bible': return <BookOpen className="h-8 w-8" />;
      case 'article': return <FileTextIcon className="h-8 w-8" />;
      case 'blog': return <MessageSquare className="h-8 w-8" />;
      case 'website': return <Globe className="h-8 w-8" />;
      case 'speech': return <Mic className="h-8 w-8" />;
      case 'research_paper': return <ScrollText className="h-8 w-8" />;
      default: return <FileText className="h-8 w-8" />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-10 w-10 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg" />
    );
  }

  // Show article icon for PDFs
  if (url.toLowerCase().endsWith('.pdf')) {
    return <FileTextIcon className="h-10 w-10" />;
  }

  if (hasError || (!ogImage && !favicon)) {
    return getFallbackIcon();
  }

  if (ogImage) {
    return (
      <div className="relative h-10 w-10">
        <Image
          src={ogImage}
          alt=""
          fill
          className="object-cover rounded-lg"
          onError={() => {
            setOgImage(null);
            if (!favicon) setHasError(true);
          }}
        />
      </div>
    );
  }

  if (favicon) {
    return (
      <div className="relative h-10 w-10">
        <Image
          src={favicon}
          alt=""
          fill
          className="object-contain p-1.5"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return getFallbackIcon();
} 