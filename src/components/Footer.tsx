import { Facebook, Linkedin, Mail, Phone, ArrowUp } from "lucide-react";
import logoSodistra from "@/assets/logo-sodistra-footer.png";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import chargeuseTruck from "@/assets/chargeuse-truck.png";
import bulldozer from "@/assets/bulldozer.png";
import { supabase } from "@/integrations/supabase/client";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [services, setServices] = useState<{
    id: string;
    title: string;
  }[]>([]);
  const footerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setShowScrollButton(entry.isIntersecting);
    }, {
      threshold: 0.1
    });
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    const fetchServices = async () => {
      const {
        data
      } = await supabase.from("services").select("id, title").eq("is_active", true).order("display_order", {
        ascending: true
      });
      if (data) setServices(data);
    };
    fetchServices();
  }, []);
  const handleNavigation = (href: string) => {
    if (href.startsWith("/") && !href.includes("#")) {
      navigate(href);
      return;
    }
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth"
          });
        }
      }, 100);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const navigationItems = [{
    label: "À propos",
    href: "#apropos"
  }, {
    label: "Services",
    href: "#services"
  }, {
    label: "Réalisations",
    href: "#realisations"
  }, {
    label: "Atouts",
    href: "#atouts"
  }, {
    label: "Actions RSE",
    href: "#actualites"
  }, {
    label: "Carrière",
    href: "/carriere"
  }, {
    label: "Contact",
    href: "#contact"
  }];
  return <footer ref={footerRef} className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Bulldozers animation */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden pointer-events-none">
        <img src={chargeuseTruck} alt="Chargeuse" className="h-12 w-auto animate-roll-truck opacity-30" />
        <img src={bulldozer} alt="Bulldozer" className="h-10 w-auto animate-roll-truck-reverse absolute bottom-0 opacity-30" />
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <img src={logoSodistra} alt="Logo SODISTRA" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-primary-foreground/70 mb-4">
              Votre partenaire de confiance pour tous vos projets de construction en Côte d'Ivoire.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/p/16YFSrTZfY/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.linkedin.com/company/sodistra-s-a/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigationItems.map(item => <li key={item.label}>
                  <button onClick={() => handleNavigation(item.href)} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {item.label}
                  </button>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-primary-foreground/70">
              {services.map(service => <li key={service.id}>
                  <button onClick={() => handleNavigation("#services")} className="hover:text-accent transition-colors text-left">
                    {service.title}
                  </button>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone size={18} className="flex-shrink-0" />
                <span>(+225) 27 22 47 39 96</span>
              </li>
              
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-primary-foreground/70">
          <p>© {currentYear} SODISTRA. Tous droits réservés.</p>
        </div>
      </div>

      {showScrollButton && <Button onClick={scrollToTop} className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-accent hover:bg-accent-light text-accent-foreground shadow-lg transition-all duration-300 hover:scale-110" size="icon" aria-label="Retour en haut">
          <ArrowUp size={24} />
        </Button>}
    </footer>;
};
export default Footer;