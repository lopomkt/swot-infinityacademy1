
import React from 'react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="py-4 border-b">
      <div className="container-custom flex justify-between items-center">
        <div className="font-medium text-lg">SimpleSite</div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm hover:text-primary transition-colors">Início</a>
          <a href="#sobre" className="text-sm hover:text-primary transition-colors">Sobre</a>
          <a href="#contato" className="text-sm hover:text-primary transition-colors">Contato</a>
        </nav>
        <Button variant="outline" size="sm" className="md:hidden">Menu</Button>
      </div>
    </header>
  );
};

export default Header;
