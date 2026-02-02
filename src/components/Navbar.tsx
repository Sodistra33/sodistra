import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSodistraBlanc from "@/assets/logo-sodistra-blanc.png";
import logoSodistraBleu from "@/assets/logo-sodistra-bleu.png";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  href: string;
  subItems?: SubMenuItem[];
}

interface Service {
  id: string;
  title: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchServices();
    fetchBrochure();
  }, []);

  const fetchBrochure = async () => {
    try {
      const { data, error } = await supabase
        .from('brochures')
        .select('file_path')
        .eq('is_active', true)
        .limit(1)
        .single();
      if (error) throw error;
      setBrochureUrl(data?.file_path || null);
    } catch (error) {
      console.error('Error fetching brochure:', error);
    }
  };

  const handleDownloadBrochure = () => {
    if (brochureUrl) {
      window.open(brochureUrl, '_blank');
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const getMenuItems = (): MenuItem[] => {
    const serviceSubItems: SubMenuItem[] = services.map(service => ({
      label: service.title,
      href: `/projets?category=${encodeURIComponent(service.title)}`
    }));

    return [
      { label: t('nav.about'), href: "#apropos" },
      { 
        label: t('nav.achievements'), 
        href: "#realisations",
        subItems: [
          { label: t('nav.all_projects'), href: "/projets" },
          { label: t('nav.sanitation_rehab'), href: "/projets?category=Assainissement%20et%20R%C3%A9habilitations" },
          { label: t('nav.bridges_roads'), href: "/projets?category=Ponts%20et%20Voiries" },
          { label: t('nav.hydro_works'), href: "/projets?category=Ouvrages%20Hydro-Agricoles" },
          { label: t('nav.new_roads'), href: "/projets?category=Routes%20neuves" },
          { label: t('nav.industrial_zones'), href: "/projets?category=Construction%20de%20zones%20industrielles" },
          { label: t('nav.sanitation_roads'), href: "/projets?category=Assainissement%20et%20voieries" },
        ]
      },
      { label: t('nav.advantages'), href: "#atouts" },
      { label: t('nav.rse'), href: "#actualites" },
      { 
        label: t('nav.career'), 
        href: "/carriere",
        subItems: [
          { label: t('nav.job_offers'), href: "/carriere#offres" },
          { label: t('nav.apply'), href: "/carriere#postuler" },
        ]
      },
      { label: t('nav.contact'), href: "#contact" },
    ];
  };

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
    
    // Si c'est une route avec query params (ex: /projets?category=...)
    if (href.startsWith('/') && href.includes('?')) {
      navigate(href);
      return;
    }
    
    // Si c'est une route complète avec hash (ex: /carriere#offres)
    if (href.includes('#') && href.startsWith('/')) {
      const [path, hash] = href.split('#');
      navigate(path);
      setTimeout(() => {
        const element = document.querySelector(`#${hash}`);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    
    // Si c'est une route complète (ex: /carriere)
    if (href.startsWith('/') && !href.includes('#')) {
      navigate(href);
      return;
    }
    
    // Si on n'est pas sur la page d'accueil, naviguer d'abord vers l'accueil
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    
    // Sinon, faire défiler vers la section
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMouseEnter = (label: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
    setCloseTimeout(timeout);
  };

  const toggleMobileDropdown = (label: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === label ? null : label);
  };

  const menuItems = getMenuItems();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={handleLogoClick}
            className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
            aria-label="Retour à l'accueil"
            type="button"
          >
            <img 
              src={isScrolled ? logoSodistraBleu : logoSodistraBlanc} 
              alt="Logo SODISTRA" 
              className="h-12 w-auto object-contain cursor-pointer" 
            />
          </button>

          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.subItems && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`text-sm font-medium transition-colors hover:text-accent flex items-center gap-1 ${
                    isScrolled ? "text-foreground" : "text-white"
                  }`}
                >
                  {item.label}
                  {item.subItems && <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />}
                </button>
                
                {/* Dropdown menu with bridge area */}
                {item.subItems && openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="w-56 bg-background border border-border rounded-lg shadow-lg z-50 py-2">
                    {item.subItems.map((subItem) => (
                        <button
                          key={subItem.label}
                          onClick={() => handleNavigation(subItem.href)}
                          className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher isScrolled={isScrolled} />
            <Button
              onClick={handleDownloadBrochure}
              className="bg-accent hover:bg-accent-light text-accent-foreground"
              disabled={!brochureUrl}
            >
              {t('nav.download_brochure')}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden ${isScrolled ? "text-foreground" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4">
            {menuItems.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => item.subItems ? toggleMobileDropdown(item.label) : handleNavigation(item.href)}
                  className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  {item.label}
                  {item.subItems && <ChevronDown size={14} className={`transition-transform ${mobileOpenDropdown === item.label ? 'rotate-180' : ''}`} />}
                </button>
                
                {/* Mobile submenu */}
                {item.subItems && mobileOpenDropdown === item.label && (
                  <div className="pl-4 border-l-2 border-accent ml-2 mb-2">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.label}
                        onClick={() => handleNavigation(subItem.href)}
                        className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-center mt-4 mb-2">
              <LanguageSwitcher isScrolled={true} />
            </div>
            <Button
              onClick={handleDownloadBrochure}
              className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
              disabled={!brochureUrl}
            >
              {t('nav.download_brochure')}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;