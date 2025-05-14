
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container-custom text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">Bem-vindo ao SimpleSite</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
          Um site simples e pequeno, perfeito para apresentar sua marca de maneira elegante e direta.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary hover:bg-primary/90">Saiba Mais</Button>
          <Button variant="outline">Contato</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
