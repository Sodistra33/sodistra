import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSodistraBlanc from "@/assets/logo-sodistra-blanc.png";
import logoSodistraBleu from "@/assets/logo-sodistra-bleu.png";
import { useNavigate, useLocation } from "react-router-dom";

interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  href: string;
  subItems?: SubMenuItem[];
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems: MenuItem[] = [
    { label: "À propos", href: "#apropos" },
    { label: "Services", href: "#services" },
    { 
      label: "Réalisations", 
      href: "#realisations",
      subItems: [
        { label: "Tous les projets", href: "/projets" },
        { label: "Bâtiments", href: "/projets?categorie=batiment" },
        { label: "Infrastructures", href: "/projets?categorie=infrastructure" },
        { label: "Rénovation", href: "/projets?categorie=renovation" },
      ]
    },
    { label: "Atouts", href: "#atouts" },
    { label: "Actions RSE", href: "#actualites" },
    { 
      label: "Carrière", 
      href: "/carriere",
      subItems: [
        { label: "Offres d'emploi", href: "/carriere#offres" },
        { label: "Postuler", href: "/carriere#postuler" },
      ]
    },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
    
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
    
    // Si c'est une route complète (ex: /carriere ou /projets?categorie=batiment)
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
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const toggleMobileDropdown = (label: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === label ? null : label);
  };

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
                
                {/* Dropdown menu */}
                {item.subItems && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50 py-2">
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
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button
              onClick={() => {
                console.log("Téléchargement de la brochure");
              }}
              className="bg-accent hover:bg-accent-light text-accent-foreground"
            >
              Télécharger notre brochure
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
            <Button
              onClick={() => {
                console.log("Téléchargement de la brochure");
              }}
              className="w-full mt-4 bg-accent hover:bg-accent-light text-accent-foreground"
            >
              Télécharger notre brochure
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;