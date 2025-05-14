
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <section className="py-16" id="contato">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Entre em Contato</h2>
        <div className="max-w-md mx-auto">
          <form className="space-y-4">
            <div>
              <Input placeholder="Nome" />
            </div>
            <div>
              <Input type="email" placeholder="Email" />
            </div>
            <div>
              <Textarea placeholder="Mensagem" className="min-h-[120px]" />
            </div>
            <Button className="w-full">Enviar Mensagem</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
