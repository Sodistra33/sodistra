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
    'hero.fallback_title': 'Votre partenaire de confiance',
    'hero.fallback_subtitle': 'Excellence, innovation et fiabilité au service de vos projets de construction en Côte d\'Ivoire',
    'hero.in_construction': 'dans la construction',
    
    // About
    'about.section_title': 'À propos de nous',
    'about.years': '20 ans',
    'about.years_expertise': 'd\'expertise',
    'about.excellence': 'Excellence et qualité garanties',
    'about.experience': '20 ans d\'expertise',
    'about.team': 'Équipe de professionnels qualifiés',
    'about.deadlines': 'Respect des délais et budgets',
    'about.no_image': 'Aucune image disponible',
    'about.default_title': 'La meilleure construction avec une cohérence de conception',
    'about.default_description': 'SODISTRA est une entreprise générale de bâtiment & travaux publics spécialisée dans les travaux de construction/réhabilitation, les travaux routiers et de voirie, l\'assainissement, la construction de zones industrielles et d\'ouvrages divers.',
    
    // Services
    'services.section_title': 'Nos services',
    'services.title': 'Quels services',
    'services.title_accent': 'offrons-nous ?',
    'services.subtitle': 'Une gamme complète de services pour répondre à tous vos besoins en construction',
    
    // Projects
    'projects.section_title': 'Nos Réalisations',
    'projects.title': 'Découvrez nos',
    'projects.title_accent': 'projets',
    'projects.subtitle': 'Un portfolio diversifié de projets réussis en Côte d\'Ivoire',
    'projects.view_all': 'Voir tous les projets',
    'projects.completed': 'Terminé',
    'projects.in_progress': 'En cours',
    
    // Advantages
    'advantages.section_title': 'Nos atouts',
    'advantages.title': 'Pourquoi nous',
    'advantages.title_accent': 'choisir ?',
    'advantages.subtitle': 'Des valeurs fortes et un engagement total envers la satisfaction de nos clients',
    'advantages.reliability_title': 'Fiabilité garantie',
    'advantages.reliability_desc': 'Engagement total sur la qualité et la durabilité de nos constructions avec garanties complètes.',
    'advantages.expertise_title': 'Expertise locale',
    'advantages.expertise_desc': '20 ans d\'expérience en Côte d\'Ivoire avec une connaissance approfondie du terrain.',
    'advantages.deadlines_title': 'Délais respectés',
    'advantages.deadlines_desc': 'Gestion rigoureuse des projets pour livrer dans les temps convenus sans compromis sur la qualité.',
    'advantages.innovation_title': 'Innovation',
    'advantages.innovation_desc': 'Utilisation des dernières technologies et méthodes de construction pour des résultats optimaux.',
    
    // Blog
    'blog.title': 'Restez',
    'blog.title_accent': 'informés de nos actions RSE',
    'blog.subtitle': 'Découvrez nos dernières actualités et actions RSE',
    'blog.read_more': 'Lire la suite',
    'blog.view_more': 'Voir plus d\'actualités',
    'blog.no_articles': 'Aucune actualité disponible pour le moment.',
    
    // Contact
    'contact.title': 'Contactez',
    'contact.title_accent': 'nous',
    'contact.subtitle': 'Besoin d\'informations sur nos services ? N\'hésitez pas à nous contacter',
    'contact.send_message': 'Envoyez-nous un message',
    'contact.name': 'Nom complet',
    'contact.email': 'Email',
    'contact.phone': 'Téléphone',
    'contact.subject': 'Sujet',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le message',
    'contact.sending': 'Envoi en cours...',
    'contact.success_title': 'Message envoyé',
    'contact.success_desc': 'Nous vous répondrons dans les plus brefs délais.',
    'contact.error_title': 'Erreur',
    'contact.error_desc': 'Une erreur est survenue. Veuillez réessayer.',
    'contact.phone_title': 'Téléphone',
    'contact.hours_title': 'Heures d\'ouverture',
    'contact.hours_content': 'Lun-Ven: 8h-12h / 14h30-17h30 | Sam: 8h-12h',
    'contact.address_title': 'Adresse',
    'contact.your_name': 'Votre nom',
    'contact.your_email': 'votre@email.com',
    'contact.your_phone': '+225 XX XX XX XX XX',
    'contact.subject_placeholder': 'Objet de votre message',
    'contact.message_placeholder': 'Votre message...',
    
    // Footer
    'footer.description': 'Votre partenaire de confiance pour tous vos projets de construction en Côte d\'Ivoire.',
    'footer.navigation': 'Navigation',
    'footer.services': 'Services',
    'footer.contact': 'Contact',
    'footer.rights': 'Tous droits réservés',
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
    'hero.fallback_title': 'Your trusted partner',
    'hero.fallback_subtitle': 'Excellence, innovation and reliability at the service of your construction projects in Ivory Coast',
    'hero.in_construction': 'in construction',
    
    // About
    'about.section_title': 'About us',
    'about.years': '20 years',
    'about.years_expertise': 'of expertise',
    'about.excellence': 'Guaranteed excellence and quality',
    'about.experience': '20 years of expertise',
    'about.team': 'Team of qualified professionals',
    'about.deadlines': 'Meeting deadlines and budgets',
    'about.no_image': 'No image available',
    'about.default_title': 'The best construction with design consistency',
    'about.default_description': 'SODISTRA is a general building & public works company specialized in construction/rehabilitation works, road and street works, sanitation, construction of industrial zones and various structures.',
    
    // Services
    'services.section_title': 'Our services',
    'services.title': 'What services',
    'services.title_accent': 'do we offer?',
    'services.subtitle': 'A complete range of services to meet all your construction needs',
    
    // Projects
    'projects.section_title': 'Our Projects',
    'projects.title': 'Discover our',
    'projects.title_accent': 'projects',
    'projects.subtitle': 'A diverse portfolio of successful projects in Ivory Coast',
    'projects.view_all': 'View all projects',
    'projects.completed': 'Completed',
    'projects.in_progress': 'In progress',
    
    // Advantages
    'advantages.section_title': 'Our strengths',
    'advantages.title': 'Why choose',
    'advantages.title_accent': 'us?',
    'advantages.subtitle': 'Strong values and total commitment to customer satisfaction',
    'advantages.reliability_title': 'Guaranteed reliability',
    'advantages.reliability_desc': 'Total commitment to quality and durability of our constructions with complete guarantees.',
    'advantages.expertise_title': 'Local expertise',
    'advantages.expertise_desc': '20 years of experience in Ivory Coast with in-depth knowledge of the terrain.',
    'advantages.deadlines_title': 'Deadlines met',
    'advantages.deadlines_desc': 'Rigorous project management to deliver on time without compromising on quality.',
    'advantages.innovation_title': 'Innovation',
    'advantages.innovation_desc': 'Using the latest technologies and construction methods for optimal results.',
    
    // Blog
    'blog.title': 'Stay',
    'blog.title_accent': 'informed about our CSR actions',
    'blog.subtitle': 'Discover our latest news and CSR actions',
    'blog.read_more': 'Read more',
    'blog.view_more': 'View more news',
    'blog.no_articles': 'No news available at the moment.',
    
    // Contact
    'contact.title': 'Contact',
    'contact.title_accent': 'us',
    'contact.subtitle': 'Need information about our services? Feel free to contact us',
    'contact.send_message': 'Send us a message',
    'contact.name': 'Full name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send message',
    'contact.sending': 'Sending...',
    'contact.success_title': 'Message sent',
    'contact.success_desc': 'We will respond as soon as possible.',
    'contact.error_title': 'Error',
    'contact.error_desc': 'An error occurred. Please try again.',
    'contact.phone_title': 'Phone',
    'contact.hours_title': 'Opening hours',
    'contact.hours_content': 'Mon-Fri: 8am-12pm / 2:30pm-5:30pm | Sat: 8am-12pm',
    'contact.address_title': 'Address',
    'contact.your_name': 'Your name',
    'contact.your_email': 'your@email.com',
    'contact.your_phone': '+225 XX XX XX XX XX',
    'contact.subject_placeholder': 'Subject of your message',
    'contact.message_placeholder': 'Your message...',
    
    // Footer
    'footer.description': 'Your trusted partner for all your construction projects in Ivory Coast.',
    'footer.navigation': 'Navigation',
    'footer.services': 'Services',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved',
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
