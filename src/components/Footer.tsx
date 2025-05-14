
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="py-8 border-t">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-medium">SimpleSite</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {year} SimpleSite. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
