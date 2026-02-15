"use client";

import Link from "next/link";
import { appConfig } from '@/config/app.config';
import { BUILDER_NAME, BUILDER_URL, APP_TAGLINE } from "@/config/branding";

// Import shared components
import { Connector } from "@/components/shared/layout/curvy-rect";
import HeroFlame from "@/components/shared/effects/flame/hero-flame";
import { HeaderProvider } from "@/components/shared/header/HeaderContext";
import { CompanionChat } from "@/components/CompanionChat";

// Import hero section components
import HomeHeroBackground from "@/components/app/(home)/sections/hero/Background/Background";
import { BackgroundOuterPiece } from "@/components/app/(home)/sections/hero/Background/BackgroundOuterPiece";
import HomeHeroBadge from "@/components/app/(home)/sections/hero/Badge/Badge";
import HomeHeroPixi from "@/components/app/(home)/sections/hero/Pixi/Pixi";
import HomeHeroTitle from "@/components/app/(home)/sections/hero/Title/Title";
import HeroInputSubmitButton from "@/components/app/(home)/sections/hero-input/Button/Button";

// Import header components
import HeaderBrandKit from "@/components/shared/header/BrandKit/BrandKit";
import HeaderWrapper from "@/components/shared/header/Wrapper/Wrapper";
import HeaderDropdownWrapper from "@/components/shared/header/Dropdown/Wrapper/Wrapper";
import GithubIcon from "@/components/shared/header/Github/_svg/GithubIcon";
import ButtonUI from "@/components/ui/shadcn/button"

import { useHome } from "@/hooks/useHome";

export default function HomePage() {
  const {
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
    additionalInstructions, setAdditionalInstructions,
    extendBrandStyles, setExtendBrandStyles,
    validateUrl, isURL, handleSubmit
  } = useHome();

  const styles = [
    { id: "1", name: "Glassmorphism", description: "Frosted glass effect" },
    { id: "2", name: "Neumorphism", description: "Soft 3D shadows" },
    { id: "3", name: "Brutalism", description: "Bold and raw" },
    { id: "4", name: "Minimalist", description: "Clean and simple" },
    { id: "5", name: "Dark Mode", description: "Dark theme design" },
    { id: "6", name: "Gradient Rich", description: "Vibrant gradients" },
    { id: "7", name: "3D Depth", description: "Dimensional layers" },
    { id: "8", name: "Retro Wave", description: "80s inspired" },
  ];

  const models = appConfig.ai.availableModels.map(model => ({
    id: model,
    name: appConfig.ai.modelDisplayNames[model] || model,
  }));

  return (
    <HeaderProvider>
      <div className="min-h-screen bg-background-base">
        <HeaderDropdownWrapper />

        <div className="sticky top-0 left-0 w-full z-[101] bg-background-base header">
          <div className="absolute top-0 cmw-container border-x border-border-faint h-full pointer-events-none" />
          <div className="h-1 bg-border-faint w-full left-0 -bottom-1 absolute" />
          <div className="cmw-container absolute h-full pointer-events-none top-0">
            <Connector className="absolute -left-[10.5px] -bottom-11" />
            <Connector className="absolute -right-[10.5px] -bottom-11" />
          </div>

          <HeaderWrapper>
            <div className="max-w-[900px] mx-auto w-full flex justify-between items-center">
              <div className="flex gap-24 items-center">
                <HeaderBrandKit />
              </div>
              <div className="flex gap-8">
                <a
                  className="contents"
                  href="https://github.com/mendableai/space-by-creative"
                  target="_blank"
                >
                  <ButtonUI variant="tertiary">
                    <GithubIcon />
                    Use this Template
                  </ButtonUI>
                </a>
              </div>
            </div>
          </HeaderWrapper>
        </div>

        <section className="overflow-x-clip" id="home-hero">
          <div className="pt-28 lg:pt-254 lg:-mt-100 pb-115 relative" id="hero-content">
            <HomeHeroPixi />
            <HeroFlame />
            <BackgroundOuterPiece />
            <HomeHeroBackground />

            <div className="relative container px-16">
              <HomeHeroBadge />
              <HomeHeroTitle />
              <p className="text-center text-body-large font-mono uppercase tracking-widest mt-4">
                {APP_TAGLINE}
              </p>
              <div className="flex flex-col items-center gap-4 mt-12">
                <Link
                  className="brutalist-button uppercase tracking-widest text-sm"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Powered by Firecrawl.
                </Link>
                <a
                  className="text-label-small text-black-alpha-48 hover:text-black-alpha-72 transition-all"
                  href={BUILDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Developed by {BUILDER_NAME}
                </a>
              </div>
            </div>
          </div>

          <div className="container lg:contents !p-16 relative -mt-90">
            <div className="absolute top-0 left-[calc(50%-50vw)] w-screen h-1 bg-border-faint lg:hidden" />
            <div className="absolute bottom-0 left-[calc(50%-50vw)] w-screen h-1 bg-border-faint lg:hidden" />
            <Connector className="-top-10 -left-[10.5px] lg:hidden" />
            <Connector className="-top-10 -right-[10.5px] lg:hidden" />
            <Connector className="-bottom-10 -left-[10.5px] lg:hidden" />
            <Connector className="-bottom-10 -right-[10.5px] lg:hidden" />

            <div className="max-w-552 mx-auto z-[11] lg:z-[2]">
              <div className="rounded-20 -mt-30 lg:-mt-30">
                <div
                  className="bg-white rounded-20 relative z-10"
                  style={{
                    boxShadow:
                      "0px 0px 44px 0px rgba(0, 0, 0, 0.02), 0px 88px 56px -20px rgba(0, 0, 0, 0.03), 0px 56px 56px -20px rgba(0, 0, 0, 0.02), 0px 32px 32px -20px rgba(0, 0, 0, 0.03), 0px 16px 24px -12px rgba(0, 0, 0, 0.03), 0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 0px 0px 10px #F9F9F9",
                  }}
                >
                  <div className="p-[28px] flex gap-12 items-center w-full relative bg-white rounded-20">
                    {hasSearched && searchResults.length > 0 && !isFadingOut ? (
                      <>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 flex-shrink-0">
                          <rect x="2" y="4" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                          <rect x="11" y="4" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                          <rect x="2" y="11" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                          <rect x="11" y="11" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        <div className="flex-1 text-body-input text-accent-black">
                          Select which site to clone from the results below
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsFadingOut(true);
                            setTimeout(() => {
                              setSearchResults([]);
                              setHasSearched(false);
                              setShowSearchTiles(false);
                              setIsFadingOut(false);
                              setUrl('');
                            }, 500);
                          }}
                          className="button relative rounded-10 px-12 py-8 text-label-medium font-medium flex items-center justify-center gap-6 bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-[0.995] transition-all"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                            <path d="M14 14L10 10M11 6.5C11 9 9 11 6.5 11C4 11 2 9 2 6.5C2 4 4 2 6.5 2C9 2 11 4 11 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span>Search Again</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {isURL(url) ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 flex-shrink-0">
                            <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 flex-shrink-0">
                            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M12.5 12.5L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                        <input
                          className="flex-1 bg-transparent text-body-input text-accent-black placeholder:text-black-alpha-48 focus:outline-none focus:ring-0 focus:border-transparent"
                          placeholder="Enter URL or search term..."
                          type="text"
                          value={url}
                          disabled={isSearching}
                          onChange={(e) => {
                            const value = e.target.value;
                            setUrl(value);
                            setIsValidUrl(validateUrl(value));
                            if (value.trim() === "") {
                              setShowSearchTiles(false);
                              setHasSearched(false);
                              setSearchResults([]);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !isSearching) {
                              e.preventDefault();
                              handleSubmit();
                            }
                          }}
                        />
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isSearching) {
                              handleSubmit();
                            }
                          }}
                          className={isSearching ? 'pointer-events-none' : ''}
                        >
                          <HeroInputSubmitButton 
                            dirty={url.length > 0} 
                            buttonText={isURL(url) ? 'Scrape Site' : 'Search'} 
                            disabled={isSearching}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isValidUrl ? (extendBrandStyles ? 'max-h-[400px]' : 'max-h-[300px]') + ' opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-[28px] pt-0 pb-[28px]">
                      <div className="border-t border-gray-100 bg-white">
                        <div className="py-8 grid grid-cols-2 items-center gap-12 group cursor-pointer" onClick={() => setExtendBrandStyles(!extendBrandStyles)}>
                          <div className="flex select-none">
                            <div className="flex lg-max:flex-col whitespace-nowrap flex-wrap min-w-0 gap-8 lg:justify-between flex-1">
                              <div className="text-xs font-medium text-black-alpha-72 transition-all group-hover:text-accent-black relative">
                                Extend brand styles
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              className="transition-all relative rounded-full group bg-black-alpha-10"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExtendBrandStyles(!extendBrandStyles);
                              }}
                              style={{
                                width: '50px',
                                height: '20px',
                                boxShadow: 'rgba(0, 0, 0, 0.02) 0px 6px 12px 0px inset, rgba(0, 0, 0, 0.02) 0px 0.75px 0.75px 0px inset, rgba(0, 0, 0, 0.04) 0px 0.25px 0.25px 0px inset'
                              }}
                            >
                              <div
                                className={`overlay transition-opacity ${extendBrandStyles ? 'opacity-100' : 'opacity-0'}`}
                                style={{ background: 'color(display-p3 0.9059 0.3294 0.0784)', backgroundColor: '#FA4500' }}
                              />
                              <div
                                className="top-[2px] left-[2px] transition-all absolute rounded-full bg-accent-white"
                                style={{
                                  width: '28px',
                                  height: '16px',
                                  boxShadow: 'rgba(0, 0, 0, 0.06) 0px 6px 12px -3px, rgba(0, 0, 0, 0.06) 0px 3px 6px -1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) 0px 0.5px 0.5px 0px',
                                  transform: extendBrandStyles ? 'translateX(16px)' : 'none'
                                }}
                              />
                            </button>
                          </div>
                        </div>

                        {extendBrandStyles && (
                          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <textarea
                              className="w-full p-12 text-sm border border-gray-100 rounded-12 focus:outline-none focus:ring-1 focus:ring-accent-orange/20 focus:border-accent-orange/30 min-h-[100px] resize-none"
                              placeholder="Describe what you want to build using this brand's styles (e.g., 'A landing page for a coffee shop using these colors and fonts')"
                              value={additionalInstructions}
                              onChange={(e) => setAdditionalInstructions(e.target.value)}
                            />
                          </div>
                        )}

                        {!extendBrandStyles && (
                          <div className="mt-4 grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-black-alpha-48">Style</label>
                              <select 
                                className="w-full p-8 text-xs border border-gray-100 rounded-8 focus:outline-none"
                                value={selectedStyle}
                                onChange={(e) => setSelectedStyle(e.target.value)}
                              >
                                {styles.map(style => (
                                  <option key={style.id} value={style.id}>{style.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex flex-col gap-4">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-black-alpha-48">Model</label>
                              <select 
                                className="w-full p-8 text-xs border border-gray-100 rounded-8 focus:outline-none"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                              >
                                {models.map(model => (
                                  <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CompanionChat />
      </div>
    </HeaderProvider>
  );
}
