import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useScraper() {
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeData, setScrapeData] = useState<any>(null);

  const scrapeUrl = useCallback(async (url: string) => {
    if (!url) return;
    setIsScraping(true);
    try {
      const response = await fetch('/api/scrape-url-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (data.success) {
        setScrapeData(data);
        return data;
      } else {
        throw new Error(data.error || 'Failed to scrape URL');
      }
    } catch (error) {
      console.error('Error scraping URL:', error);
      toast.error('Failed to scrape URL');
      return null;
    } finally {
      setIsScraping(false);
    }
  }, []);

  const extractBranding = useCallback(async (url: string) => {
    if (!url) return;
    try {
      const response = await fetch('/api/extract-brand-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      return await response.json();
    } catch (error) {
      console.error('Error extracting branding:', error);
      return null;
    }
  }, []);

  return {
    isScraping,
    setIsScraping,
    scrapeData,
    setScrapeData,
    scrapeUrl,
    extractBranding
  };
}
