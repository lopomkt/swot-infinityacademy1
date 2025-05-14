
import React from 'react';

const Features = () => {
  const features = [
    {
      title: "Simples",
      description: "Design minimalista focado em usabilidade e clareza."
    },
    {
      title: "Rápido",
      description: "Carregamento otimizado para uma experiência fluida."
    },
    {
      title: "Responsivo",
      description: "Adaptado para todos os tamanhos de dispositivos."
    }
  ];

  return (
    <section className="py-12 bg-secondary" id="sobre">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Nossos Diferenciais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
