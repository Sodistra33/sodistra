import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown } from "lucide-react";

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

const FrenchFlag = () => (
  <svg viewBox="0 0 3 2" className="w-full h-full">
    <rect width="1" height="2" x="0" fill="#002395" />
    <rect width="1" height="2" x="1" fill="#FFFFFF" />
    <rect width="1" height="2" x="2" fill="#ED2939" />
  </svg>
);

const UKFlag = () => (
  <svg viewBox="0 0 60 30" className="w-full h-full">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const LanguageSwitcher = ({ isScrolled = false }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: 'fr' | 'en') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border-2 transition-all ${
          isScrolled 
            ? 'border-primary/20 hover:border-accent bg-white/90' 
            : 'border-white/30 hover:border-accent bg-white/10'
        }`}
        aria-label="Sélectionner la langue"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-4 rounded overflow-hidden">
          {language === 'fr' ? <FrenchFlag /> : <UKFlag />}
        </div>
        <span className={`text-sm font-medium ${isScrolled ? 'text-primary' : 'text-white'}`}>
          {language === 'fr' ? 'FR' : 'EN'}
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isScrolled ? 'text-primary' : 'text-white'
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50 min-w-[120px]">
          <button
            onClick={() => handleSelect('fr')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors ${
              language === 'fr' ? 'bg-accent/10' : ''
            }`}
          >
            <div className="w-6 h-4 rounded overflow-hidden border border-border">
              <FrenchFlag />
            </div>
            <span className="text-sm font-medium text-foreground">Français</span>
          </button>
          <button
            onClick={() => handleSelect('en')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors ${
              language === 'en' ? 'bg-accent/10' : ''
            }`}
          >
            <div className="w-6 h-4 rounded overflow-hidden border border-border">
              <UKFlag />
            </div>
            <span className="text-sm font-medium text-foreground">English</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
