import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const articles = [
    {
      id: 1,
      title: "Participation au Salon International de la Construction 2025",
      date: "15 Mars 2025",
      excerpt: "SODISTRA sera présente au Salon International de la Construction d'Abidjan. Venez découvrir nos dernières innovations et rencontrer notre équipe.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      category: "Événement",
      content: `
        <p>Nous sommes ravis d'annoncer notre participation au Salon International de la Construction d'Abidjan 2025, qui se tiendra du 20 au 25 mars au Parc des Expositions d'Abidjan.</p>
        
        <h3>Au programme de notre stand :</h3>
        <ul>
          <li>Présentation de nos projets phares réalisés en 2024</li>
          <li>Démonstrations de nos nouvelles technologies de construction</li>
          <li>Rencontres avec nos ingénieurs et chefs de projet</li>
          <li>Sessions de questions-réponses sur vos projets</li>
        </ul>

        <p>Notre équipe sera présente tous les jours de 9h à 18h sur le stand B12, Hall 2. Nous vous attendons nombreux pour échanger sur vos projets et découvrir comment SODISTRA peut vous accompagner dans leur réalisation.</p>

        <p>Inscription gratuite sur présentation de cette annonce. Venez découvrir l'excellence de la construction ivoirienne !</p>
      `,
    },
    {
      id: 2,
      title: "Nouveau projet : Centre commercial moderne à Cocody",
      date: "10 Mars 2025",
      excerpt: "Nous sommes fiers d'annoncer le lancement d'un nouveau projet ambitieux : la construction d'un centre commercial de 15 000 m² à Cocody.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      category: "Nouveauté",
      content: `
        <p>SODISTRA est fier d'annoncer le démarrage d'un projet majeur : la construction d'un centre commercial moderne de 15 000 m² situé au cœur de Cocody.</p>

        <h3>Caractéristiques du projet :</h3>
        <ul>
          <li>Surface totale : 15 000 m²</li>
          <li>4 niveaux de commerces et services</li>
          <li>Parking souterrain de 300 places</li>
          <li>Espaces verts et zones de détente</li>
          <li>Technologies éco-responsables</li>
        </ul>

        <p>Ce projet ambitieux représente un investissement de plus de 12 milliards de FCFA et créera plus de 500 emplois directs et indirects. Les travaux ont débuté en mars 2025 et la livraison est prévue pour décembre 2026.</p>

        <p>Ce centre commercial sera un lieu de vie moderne, alliant commerce, loisirs et services dans un cadre architectural contemporain respectueux de l'environnement.</p>
      `,
    },
    {
      id: 3,
      title: "Journée Portes Ouvertes : Découvrez nos chantiers",
      date: "5 Mars 2025",
      excerpt: "SODISTRA organise une journée portes ouvertes sur nos chantiers en cours. Une occasion unique de voir nos équipes en action.",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
      category: "Événement",
      content: `
        <p>Pour la première fois, SODISTRA ouvre ses portes au grand public et organise une journée découverte de ses chantiers en cours.</p>

        <h3>Programme de la journée :</h3>
        <ul>
          <li>Visite guidée de 3 chantiers majeurs en cours</li>
          <li>Présentation des métiers de la construction</li>
          <li>Démonstrations de techniques de construction modernes</li>
          <li>Ateliers de sensibilisation à la sécurité sur chantier</li>
          <li>Rencontres avec nos ingénieurs et conducteurs de travaux</li>
        </ul>

        <p>Cette journée se déroulera le samedi 15 mars 2025 de 9h à 17h. Les visites sont gratuites mais l'inscription est obligatoire pour des raisons de sécurité (places limitées à 100 personnes).</p>

        <p>Inscriptions ouvertes dès maintenant via notre formulaire de contact ou par téléphone au +225 XX XX XX XX.</p>
      `,
    },
  ];

  const article = articles.find((a) => a.id === parseInt(id || "0"));

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Article non trouvé</h1>
          <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {
        console.log("Partage annulé");
      });
    } else {
      console.log("Partage non supporté");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-20 bg-secondary">
        <div className="container mx-auto px-4">
          <Button
            onClick={() => navigate("/#actualites")}
            variant="ghost"
            className="mb-8 text-primary hover:text-accent"
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour aux actualités
          </Button>

          <article className="max-w-4xl mx-auto bg-background rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-[21/9] overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-semibold rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar size={16} className="mr-2" />
                    {article.date}
                  </div>
                </div>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="text-primary hover:text-accent hover:border-accent"
                >
                  <Share2 size={18} className="mr-2" />
                  Partager
                </Button>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">
                {article.title}
              </h1>

              <div 
                className="prose prose-lg max-w-none text-foreground
                  prose-headings:text-primary prose-headings:font-bold
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-ul:text-muted-foreground prose-ul:mb-6
                  prose-li:mb-2"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Vous avez aimé cet article ? Partagez-le !
                  </p>
                  <Button
                    onClick={handleShare}
                    className="bg-accent hover:bg-accent-light text-accent-foreground"
                  >
                    <Share2 size={18} className="mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
