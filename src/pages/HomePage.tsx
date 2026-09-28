import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Intro from '../components/Intro';
import Solutions from '../components/Solutions';
import Connected from '../components/Connected';
import Portfolio from '../components/Portfolio';
import Reasons from '../components/Reasons';
import Process from '../components/Process';
import Closing from '../components/Closing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import type { ServiceId } from '../data/content';

export default function HomePage() {
  const { hash } = useLocation();
  // Clicar num card de serviço já deixa o serviço marcado no formulário.
  const [selectedServices, setSelectedServices] = useState<ServiceId[]>([]);

  const pickService = (id: ServiceId) =>
    setSelectedServices((current) => (current.includes(id) ? current : [...current, id]));

  // Vindo de outra página com /#secao, rola até a seção depois de renderizar.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <Solutions onPickService={pickService} />
        <Connected />
        <Portfolio />
        <Reasons />
        <Process />
        <Closing />
        <Contact selectedServices={selectedServices} onChangeServices={setSelectedServices} />
      </main>
      <Footer />
    </>
  );
}
