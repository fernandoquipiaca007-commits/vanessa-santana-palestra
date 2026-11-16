import { motion } from 'motion/react';
import fotoPerfil from '../assets/vanessa-santana.jpeg';

const scrollVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Authority() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 md:px-12" id="sobre-a-palestrante">
      <div className="relative z-10 mx-auto max-w-[1140px]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollVariant}
            className="flex justify-center lg:order-2 lg:col-span-5"
          >
            <div className="w-full max-w-[420px] overflow-hidden rounded-[24px] border border-slate-100 shadow-lg">
              <img
                src={fotoPerfil}
                alt="Vanessa Santana dos Santos"
                className="block h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollVariant}
            className="space-y-6 lg:order-1 lg:col-span-7"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a7620]">
                Sobre a palestrante
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#0b2b35] md:text-4xl">
                Vanessa Santana dos Santos
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#0f172a]/75">
                Advogada · OAB/SP 439.140
              </p>
            </div>

            <div className="space-y-5 text-justify font-sans text-sm leading-relaxed text-[#1e293b] md:text-base">
              <p>
                Vanessa atua em Execução Penal, com atenção às pessoas privadas de liberdade e às suas famílias. Seu trabalho acompanha as diferentes etapas do cumprimento da pena, com comunicação clara sobre o andamento e os próximos passos.
              </p>
              <p>
                Entre os temas de sua atuação estão a análise da condenação e dos cálculos da pena, progressão de regime, remição por trabalho, estudo e leitura, livramento condicional, indulto e comutação, quando cabíveis.
              </p>
              <p>
                O atendimento é realizado presencialmente em Hortolândia/SP e também online. A palestra tem caráter informativo e não substitui a análise individual de cada caso.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
