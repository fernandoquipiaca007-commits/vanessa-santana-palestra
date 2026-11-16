import { ArrowRight, CalendarDays, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import logoImg from '../assets/vanessa-logo.png';

const whatsappGroupLink = 'https://chat.whatsapp.com/JW02hyRM0uZEXPHAhbjUmw?s=sw&p=i&iam=2';
const whatsappContactLink = 'https://wa.me/5519984468991';

export function Hero() {
  return (
    <section className="relative px-6 pt-6 pb-20 md:px-12">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center">
        <header className="flex w-full items-center justify-center border-b border-[#0b2b35]/10 pb-8 pt-4">
          <img
            src={logoImg}
            alt="Vanessa Santana Advocacia e Consultoria"
            className="h-32 w-32 object-contain md:h-40 md:w-40"
          />
        </header>

        <div className="w-full max-w-4xl space-y-4 pt-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a7620] md:text-base">
            Palestra informativa · Execução Penal
          </p>

          <h1 className="mx-auto max-w-3xl font-sans text-2xl font-bold leading-snug text-[#0f172a] md:text-3xl lg:text-[32px]">
            Execução Penal: direitos e benefícios que as famílias precisam conhecer
          </h1>

          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#0f172a]/90 md:text-base">
            Uma conversa informativa com Vanessa Santana dos Santos sobre as etapas do cumprimento da pena e temas como progressão de regime, remição e livramento condicional.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2 text-sm font-extrabold tracking-wide text-[#0b2b35] md:text-base">
            <CalendarDays className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>26 de novembro de 2026</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 w-full max-w-[520px]"
        >
          <div
            id="inscricao"
            className="rounded-[24px] border-2 border-[#0b2b35] bg-white p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:p-8"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366]/10 text-[#168b45]">
              <MessageCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[#0f172a]">
              Acompanhe a palestra pelo WhatsApp
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#0f172a]/75">
              Entre no grupo para receber os avisos e as orientações sobre o encontro.
            </p>

            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-6 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#20ba5a] md:text-base"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Entrar no grupo da palestra
            </a>

            <a
              href={whatsappContactLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0b2b35] underline decoration-[#c59b27] underline-offset-4 hover:text-[#164250]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              WhatsApp: (19) 98446-8991
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <div className="mt-8 w-full max-w-2xl space-y-2 text-center">
          <p className="text-sm font-medium text-[#0f172a] md:text-base">
            Com Vanessa Santana dos Santos · OAB/SP 439.140
          </p>
          <p className="text-base font-bold tracking-wide text-[#0b2b35] md:text-lg">
            A voz da liberdade.
          </p>
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full max-w-[480px] items-center justify-center gap-2 rounded-xl bg-[#0b2b35] px-8 py-5 text-sm font-bold uppercase tracking-wide leading-snug text-white shadow-lg transition-colors hover:bg-[#061d24] md:text-base"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Quero acessar o grupo da palestra
          </a>
        </div>
      </div>
    </section>
  );
}
