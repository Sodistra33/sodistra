import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

const LanguageSwitcher = ({ isScrolled = false }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLanguage('fr')}
        className={`w-8 h-6 rounded overflow-hidden border-2 transition-all ${
          language === 'fr' 
            ? 'border-accent scale-110' 
            : 'border-transparent opacity-60 hover:opacity-100'
        }`}
        aria-label="Français"
        title="Français"
      >
        {/* French Flag */}
        <svg viewBox="0 0 3 2" className="w-full h-full">
          <rect width="1" height="2" x="0" fill="#002395" />
          <rect width="1" height="2" x="1" fill="#FFFFFF" />
          <rect width="1" height="2" x="2" fill="#ED2939" />
        </svg>
      </button>
      
      <button
        onClick={() => setLanguage('en')}
        className={`w-8 h-6 rounded overflow-hidden border-2 transition-all ${
          language === 'en' 
            ? 'border-accent scale-110' 
            : 'border-transparent opacity-60 hover:opacity-100'
        }`}
        aria-label="English"
        title="English"
      >
        {/* UK Flag */}
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
      </button>
    </div>
  );
};

export default LanguageSwitcher;
