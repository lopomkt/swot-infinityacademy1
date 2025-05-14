
import RedBullet from "./RedBullet";

interface WelcomeStepProps {
  onStart: () => void;
}
const WelcomeStep = ({ onStart }: WelcomeStepProps) => (
  <section className="w-full max-w-lg bg-[#f9f9f9] rounded-xl py-10 px-6 md:px-10 shadow-md border border-[#f1eaea] animate-fade-in">
    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#560005] font-manrope">
      Seja bem-vindo ao Diagnóstico Estratégico SWOT PREMIUM
    </h1>
    <h2 className="text-lg md:text-xl mb-6 text-black">
      Você está prestes a realizar um check-up completo da sua empresa. <br />
      <span className="font-medium text-[#ef0002]">
        Em menos de 40 minutos, você terá um relatório profissional com estratégias sob medida.
      </span>
    </h2>
    <ul className="text-base md:text-lg space-y-3 mb-7 text-black">
      <li className="flex items-start"><RedBullet />Diagnóstico visual e completo do seu negócio</li>
      <li className="flex items-start"><RedBullet />Relatório gerado por inteligência artificial</li>
      <li className="flex items-start"><RedBullet />Ações sugeridas com diferentes níveis de investimento</li>
      <li className="flex items-start"><RedBullet />Material final para usar com sócios, equipe ou investidores</li>
    </ul>
    <div className="flex items-center gap-2 text-[#b70001] mb-7 font-semibold">
      <span role="img" aria-label="timer">⏱️</span>
      Duração média: <span className="ml-1">35 a 40 minutos</span>
    </div>
    <button
      onClick={onStart}
      className="w-full py-3 rounded-lg bg-[#ef0002] text-white font-bold text-lg md:text-xl hover:bg-[#b70001] transition"
      aria-label="Começar diagnóstico"
    >
      Começar diagnóstico
    </button>
  </section>
);

export default WelcomeStep;
