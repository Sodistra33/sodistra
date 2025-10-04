import { Facebook, Linkedin, Mail, Phone } from "lucide-react";
import logoSodistra from "@/assets/logo-sodistra-footer.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
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
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              {["Accueil", "À propos", "Services", "Réalisations", "Contact"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(`#${item.toLowerCase().replace(/\s/g, "")}`)}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>Construction de bâtiments</li>
              <li>Génie civil</li>
              <li>Rénovation</li>
              <li>Études techniques</li>
              <li>Projets clé en main</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone size={18} className="flex-shrink-0" />
                <span>(+225) 27 22 47 39 96</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail size={18} className="flex-shrink-0" />
                <span>contact@sodistra-ci.net</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-primary-foreground/70">
          <p>© {currentYear} SODISTRA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
