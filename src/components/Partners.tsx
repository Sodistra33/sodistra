const Partners = () => {
  const partners = [
    { name: "Partenaire 1", logo: "P1" },
    { name: "Partenaire 2", logo: "P2" },
    { name: "Partenaire 3", logo: "P3" },
    { name: "Partenaire 4", logo: "P4" },
    { name: "Partenaire 5", logo: "P5" },
    { name: "Partenaire 6", logo: "P6" },
  ];

  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Nos <span className="text-accent">partenaires</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ils nous font confiance pour leurs projets de construction
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-24 h-24 bg-secondary rounded-xl flex items-center justify-center border border-border">
                <span className="text-2xl font-bold text-muted-foreground">{partner.logo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
