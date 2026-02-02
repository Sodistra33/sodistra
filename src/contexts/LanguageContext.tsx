import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navbar
    'nav.about': 'À propos',
    'nav.achievements': 'Réalisations',
    'nav.advantages': 'Atouts',
    'nav.rse': 'Actions RSE',
    'nav.career': 'Carrière',
    'nav.contact': 'Contact',
    'nav.download_brochure': 'Télécharger notre brochure',
    'nav.all_projects': 'Tous les projets',
    'nav.buildings': 'Bâtiments',
    'nav.bridges_roads': 'Ponts et Voiries',
    'nav.hydro_works': 'Ouvrages Hydro-Agricoles',
    'nav.sanitation': 'Assainissement',
    'nav.job_offers': 'Offres d\'emploi',
    'nav.apply': 'Postuler',
    
    // Hero
    'hero.title': 'Construction et BTP',
    'hero.subtitle': 'Excellence dans la construction depuis plus de 20 ans',
    'hero.cta': 'Découvrir nos services',
    
    // About
    'about.title': 'À propos de nous',
    'about.years_expertise': 'd\'expertise',
    'about.excellence': 'Excellence et qualité garanties',
    'about.experience': '20 ans d\'expertise',
    'about.team': 'Équipe de professionnels qualifiés',
    'about.deadlines': 'Respect des délais et budgets',
    
    // Services
    'services.title': 'Nos Services',
    'services.subtitle': 'Des solutions complètes pour tous vos projets',
    
    // Projects
    'projects.title': 'Nos Réalisations',
    'projects.view_all': 'Voir tous les projets',
    'projects.view_project': 'Voir le projet',
    
    // Advantages
    'advantages.title': 'Nos Atouts',
    
    // Blog
    'blog.title': 'Actions RSE',
    'blog.read_more': 'Lire la suite',
    
    // Contact
    'contact.title': 'Contactez-nous',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.phone': 'Téléphone',
    'contact.subject': 'Sujet',
    'contact.message': 'Message',
    'contact.send': 'Envoyer',
    
    // Footer
    'footer.rights': 'Tous droits réservés',
    
    // Career
    'career.title': 'Carrière',
    'career.job_offers': 'Offres d\'emploi',
    'career.apply': 'Postuler',
  },
  en: {
    // Navbar
    'nav.about': 'About',
    'nav.achievements': 'Projects',
    'nav.advantages': 'Strengths',
    'nav.rse': 'CSR Actions',
    'nav.career': 'Career',
    'nav.contact': 'Contact',
    'nav.download_brochure': 'Download our brochure',
    'nav.all_projects': 'All projects',
    'nav.buildings': 'Buildings',
    'nav.bridges_roads': 'Bridges and Roads',
    'nav.hydro_works': 'Hydro-Agricultural Works',
    'nav.sanitation': 'Sanitation',
    'nav.job_offers': 'Job offers',
    'nav.apply': 'Apply',
    
    // Hero
    'hero.title': 'Construction and Building',
    'hero.subtitle': 'Excellence in construction for over 20 years',
    'hero.cta': 'Discover our services',
    
    // About
    'about.title': 'About Us',
    'about.years_expertise': 'of expertise',
    'about.excellence': 'Guaranteed excellence and quality',
    'about.experience': '20 years of expertise',
    'about.team': 'Team of qualified professionals',
    'about.deadlines': 'Meeting deadlines and budgets',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Complete solutions for all your projects',
    
    // Projects
    'projects.title': 'Our Projects',
    'projects.view_all': 'View all projects',
    'projects.view_project': 'View project',
    
    // Advantages
    'advantages.title': 'Our Strengths',
    
    // Blog
    'blog.title': 'CSR Actions',
    'blog.read_more': 'Read more',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send',
    
    // Footer
    'footer.rights': 'All rights reserved',
    
    // Career
    'career.title': 'Career',
    'career.job_offers': 'Job offers',
    'career.apply': 'Apply',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
