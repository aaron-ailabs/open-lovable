import { useState } from "react";
import { useRouter } from "next/navigation";
import { appConfig } from '@/config/app.config';
import { toast } from "sonner";

interface SearchResult {
  url: string;
  title: string;
  description: string;
  screenshot: string | null;
  markdown: string;
}

export function useHome() {
  const [url, setUrl] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("1");
  const [selectedModel, setSelectedModel] = useState<string>(appConfig.ai.defaultModel);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  const [showSearchTiles, setShowSearchTiles] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [showSelectMessage, setShowSelectMessage] = useState<boolean>(false);
  const [showInstructionsForIndex, setShowInstructionsForIndex] = useState<number | null>(null);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [extendBrandStyles, setExtendBrandStyles] = useState<boolean>(false);
  const router = useRouter();

  const validateUrl = (urlString: string) => {
    if (!urlString) return false;
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(urlString.toLowerCase());
  };

  const isURL = (str: string): boolean => {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    return urlPattern.test(str.trim());
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || isURL(searchQuery)) {
      setSearchResults([]);
      setShowSearchTiles(false);
      return;
    }

    setIsSearching(true);
    setShowSearchTiles(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setShowSearchTiles(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Failed to perform search");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (selectedResult?: SearchResult) => {
    const inputValue = url.trim();

    if (!inputValue) {
      toast.error("Please enter a URL or search term");
      return;
    }

    if (extendBrandStyles && isURL(inputValue) && !additionalInstructions.trim()) {
      toast.error("Please describe what you want to build with this brand's styles");
      return;
    }
    
    if (selectedResult) {
      setIsFadingOut(true);
      setTimeout(() => {
        sessionStorage.setItem('targetUrl', selectedResult.url);
        sessionStorage.setItem('selectedStyle', selectedStyle);
        sessionStorage.setItem('selectedModel', selectedModel);
        sessionStorage.setItem('autoStart', 'true');
        if (selectedResult.markdown) {
          sessionStorage.setItem('siteMarkdown', selectedResult.markdown);
        }
        router.push('/generation');
      }, 500);
      return;
    }
    
    if (isURL(inputValue)) {
      if (extendBrandStyles) {
        sessionStorage.setItem('targetUrl', inputValue);
        sessionStorage.setItem('selectedModel', selectedModel);
        sessionStorage.setItem('autoStart', 'true');
        sessionStorage.setItem('brandExtensionMode', 'true');
        sessionStorage.setItem('brandExtensionPrompt', additionalInstructions || '');
        router.push('/generation');
      } else {
        sessionStorage.setItem('targetUrl', inputValue);
        sessionStorage.setItem('selectedStyle', selectedStyle);
        sessionStorage.setItem('selectedModel', selectedModel);
        sessionStorage.setItem('autoStart', 'true');
        router.push('/generation');
      }
    } else {
      if (hasSearched && searchResults.length > 0) {
        setIsFadingOut(true);
        setTimeout(async () => {
          setSearchResults([]);
          setIsFadingOut(false);
          setShowSelectMessage(true);
          await performSearch(inputValue);
          setHasSearched(true);
          setShowSearchTiles(true);
          setShowSelectMessage(false);
          setTimeout(() => {
            const carouselSection = document.querySelector('.carousel-section');
            if (carouselSection) {
              carouselSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }, 500);
      } else {
        setShowSelectMessage(true);
        setIsSearching(true);
        setHasSearched(true);
        setShowSearchTiles(true);
        setTimeout(() => {
          const carouselSection = document.querySelector('.carousel-section');
          if (carouselSection) {
            carouselSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        await performSearch(inputValue);
        setShowSelectMessage(false);
        setIsSearching(false);
        setTimeout(() => {
          const carouselSection = document.querySelector('.carousel-section');
          if (carouselSection) {
            carouselSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  };

  return {
    url, setUrl,
    selectedStyle, setSelectedStyle,
    selectedModel, setSelectedModel,
    isValidUrl, setIsValidUrl,
    showSearchTiles, setShowSearchTiles,
    searchResults, setSearchResults,
    isSearching, setIsSearching,
    hasSearched, setHasSearched,
    isFadingOut, setIsFadingOut,
    showSelectMessage, setShowSelectMessage,
    showInstructionsForIndex, setShowInstructionsForIndex,
    additionalInstructions, setAdditionalInstructions,
    extendBrandStyles, setExtendBrandStyles,
    validateUrl, isURL, handleSubmit, performSearch
  };
}
