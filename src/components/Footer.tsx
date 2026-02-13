import { Facebook, Linkedin, Instagram, MessageCircle, Phone, ArrowUp, LucideIcon } from "lucide-react";
import logoSodistra from "@/assets/logo-sodistra-footer.png";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import chargeuseTruck from "@/assets/chargeuse-truck.png";
import bulldozer from "@/assets/bulldozer-new.png";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { getServiceTranslationKey } from "@/lib/contentTranslations";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
}

const iconMap: Record<string, LucideIcon> = {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle
};

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [services, setServices] = useState<{id: string;title: string;}[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const footerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
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
    const fetchData = async () => {
      const [servicesRes, socialRes] = await Promise.all([
      supabase.
      from("services").
      select("id, title").
      eq("is_active", true).
      order("display_order", { ascending: true }),
      supabase.
      from("social_links").
      select("id, platform, url, icon_name").
      eq("is_active", true).
      order("display_order", { ascending: true })]
      );
      if (servicesRes.data) setServices(servicesRes.data);
      if (socialRes.data) setSocialLinks(socialRes.data);
    };
    fetchData();
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
          const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
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
      const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigationItems = [
  { labelKey: "nav.about", href: "#apropos" },
  { labelKey: "nav.achievements", href: "#realisations" },
  { labelKey: "nav.advantages", href: "#atouts" },
  { labelKey: "nav.rse", href: "#actualites" },
  { labelKey: "nav.career", href: "/carriere" },
  { labelKey: "nav.contact", href: "#contact" }];


  return (
    <footer
      ref={footerRef}
      className="bg-primary text-primary-foreground relative overflow-hidden">

      {/* Bulldozers animation */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden pointer-events-none">
        <img
          src={chargeuseTruck}
          alt="Chargeuse"
          className="h-12 w-auto animate-roll-truck opacity-30" />

        <img
          src={bulldozer}
          alt="Bulldozer"
          className="h-10 w-auto animate-roll-truck-reverse absolute bottom-0 opacity-30" />

      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <img
                src={logoSodistra}
                alt="Logo SODISTRA"
                className="h-12 w-auto object-contain" />

            </div>
            <p className="text-primary-foreground/70 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon_name] || Facebook;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                    aria-label={link.platform}>

                    <Icon size={20} />
                  </a>);

              })}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-2">
              {navigationItems.map((item) =>
              <li key={item.labelKey}>
                  <button
                  onClick={() => handleNavigation(item.href)}
                  className="text-primary-foreground/70 hover:text-accent transition-colors">

                    {t(item.labelKey)}
                  </button>
                </li>
              )}
            </ul>
          </div>



          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone size={18} className="flex-shrink-0" />
                <span>(+225) 27 22 47 39 96</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone size={18} className="flex-shrink-0" />
                <span>(+225) 07 09 59 65 02</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-primary-foreground/70">
          <p>© {currentYear} SODISTRA. {t('footer.rights')}.</p>
        </div>
      </div>

      {showScrollButton &&
      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-accent hover:bg-accent-light text-accent-foreground shadow-lg transition-all duration-300 hover:scale-110"
        size="icon"
        aria-label="Retour en haut">

          <ArrowUp size={24} />
        </Button>
      }
    </footer>);

};

export default Footer;