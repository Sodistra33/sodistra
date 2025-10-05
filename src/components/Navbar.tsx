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
    { label: "Accueil", href: "#accueil" },
    { label: "À propos", href: "#apropos" },
    { label: "Services", href: "#services" },
    { label: "Réalisations", href: "#realisations" },
    { label: "Atouts", href: "#atouts" },
    { label: "Actualités", href: "#actualites" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    
    // Si on n'est pas sur la page d'accueil, naviguer d'abord vers l'accueil
    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }
    
    // Sinon, faire défiler vers la section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
          <div className="flex items-center">
            <img 
              src={isScrolled ? logoSodistraBlue : logoSodistra} 
              alt="Logo SODISTRA" 
              className="h-12 w-auto object-contain" 
            />
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
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
                onClick={() => scrollToSection(item.href)}
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
