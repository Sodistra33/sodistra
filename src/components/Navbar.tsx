import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
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
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
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
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">S</span>
            </div>
            <span className={`text-xl font-bold ${isScrolled ? "text-primary" : "text-white"}`}>
              SODISTRA
            </span>
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
