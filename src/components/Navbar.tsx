import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSodistra from "@/assets/logo-sodistra.png";
import logoSodistraBlue from "@/assets/logo-sodistra-blue.png";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "À propos", href: "#apropos" },
    { label: "Services", href: "#services" },
    { label: "Réalisations", href: "#realisations" },
    { label: "Atouts", href: "#atouts" },
    { label: "Actions RSE", href: "#actualites" },
    { label: "Carrière", href: "/carriere" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    
    // Si c'est une route complète (ex: /carriere), naviguer directement
    if (href.startsWith('/') && !href.includes('#')) {
      navigate(href);
      return;
    }
    
    // Si on n'est pas sur la page d'accueil, naviguer d'abord vers l'accueil
    if (location.pathname !== '/') {
      navigate('/');
      // Attendre que la page d'accueil soit chargée puis scroller vers la section
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
              src={isScrolled ? logoSodistraBlue : logoSodistra} 
              alt="Logo SODISTRA" 
              className="h-12 w-auto object-contain cursor-pointer" 
            />
          </button>

          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button
              onClick={() => {
                // TODO: Connect to Supabase for PDF download
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
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="block w-full text-left py-3 text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => {
                // TODO: Connect to Supabase for PDF download
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
