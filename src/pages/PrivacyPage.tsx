import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contact } from '../data/content';
import { openCookiePreferences } from '../lib/cookies';
import { usePageMeta } from '../lib/usePageMeta';
import { useScrollReveal } from '../lib/useScrollReveal';
import './PrivacyPage.css';

const UPDATED = 'outubro de 2026';

export default function PrivacyPage() {
  useScrollReveal();
  usePageMeta('/privacidade');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header alwaysScrolled />
      <main className="section privacy">
        <div className="container split">
          <p className="eyebrow">Privacidade</p>
          <div>
            <h1 className="display">
              Política de <b>privacidade.</b>
            </h1>
            <p className="lead">
              Como a WAW Studio coleta, usa e protege os seus dados quando você visita o site ou fala com a gente, de
              acordo com a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).
            </p>
            <p className="privacy__updated">Última atualização: {UPDATED}.</p>
          </div>
        </div>

        <div className="container privacy__layout">
          <article className="privacy__body">
            <section>
              <h2>1. Quem somos</h2>
              <p>
                A WAW Studio é um studio de criatividade e crescimento digital fundado por Julia Alsina. Somos a
                controladora dos dados pessoais tratados neste site, ou seja, quem decide como e para que eles são
                usados.
              </p>
              <p>
                Para qualquer assunto sobre os seus dados, fale com a gente pelo WhatsApp{' '}
                <a href={`https://wa.me/${contact.whatsappNumber}`} target="_blank" rel="noreferrer">
                  {contact.whatsappDisplay}
                </a>{' '}
                ou pelo Instagram{' '}
                <a href={contact.instagramUrl} target="_blank" rel="noreferrer">
                  {contact.instagramHandle}
                </a>
                .
              </p>
            </section>

            <section>
              <h2>2. Quais dados coletamos</h2>
              <h3>Quando você preenche o formulário de contato</h3>
              <p>
                Nome, nome da empresa, cidade, número de WhatsApp, os serviços que te interessam e a mensagem que você
                escrever. Ao enviar, esses dados ficam salvos no nosso sistema interno e abrem uma conversa no WhatsApp
                já com as suas respostas.
              </p>
              <h3>Cookies de análise, só se você aceitar</h3>
              <ul>
                <li>
                  <strong>Google Analytics:</strong> páginas visitadas, tempo no site, tipo de aparelho e navegador, e
                  região aproximada.
                </li>
                <li>
                  <strong>Microsoft Clarity:</strong> cliques, rolagem e movimento na página, usados para gerar mapas de
                  calor e gravações da navegação. Textos digitados em campos são mascarados pela ferramenta.
                </li>
              </ul>
              <h3>Dados técnicos</h3>
              <p>
                Como em qualquer site, o servidor de hospedagem registra informações técnicas de acesso, como endereço
                IP, navegador e horário, para manter o site funcionando e seguro. A sua escolha sobre os cookies fica
                salva no seu próprio navegador, para o aviso não aparecer de novo.
              </p>
            </section>

            <section>
              <h2>3. Para que usamos</h2>
              <ul>
                <li>Responder o seu contato e preparar um orçamento ou proposta.</li>
                <li>Manter o histórico do atendimento, caso você vire cliente.</li>
                <li>Entender como o site é usado e melhorar o conteúdo e a navegação (só com o seu aceite).</li>
                <li>Manter o site seguro e funcionando.</li>
              </ul>
              <p>Não vendemos os seus dados e não usamos o seu contato para listas de disparo ou mensagens em massa.</p>
            </section>

            <section>
              <h2>4. Bases legais</h2>
              <ul>
                <li>
                  <strong>Formulário de contato:</strong> procedimentos preliminares de um possível contrato, a seu
                  pedido (art. 7º, V, da LGPD).
                </li>
                <li>
                  <strong>Cookies de análise:</strong> o seu consentimento (art. 7º, I), que você pode retirar a
                  qualquer momento.
                </li>
                <li>
                  <strong>Dados técnicos de acesso:</strong> legítimo interesse em manter o site seguro (art. 7º, IX).
                </li>
              </ul>
            </section>

            <section>
              <h2>5. Com quem compartilhamos</h2>
              <p>
                Usamos alguns serviços de terceiros para o site funcionar. Eles tratam os dados em nosso nome e seguem
                as suas próprias políticas de privacidade:
              </p>
              <ul>
                <li>
                  <strong>Vercel:</strong> hospedagem do site.
                </li>
                <li>
                  <strong>Supabase:</strong> banco de dados onde ficam salvos os contatos do formulário.
                </li>
                <li>
                  <strong>Google:</strong> Google Analytics (com o seu aceite).
                </li>
                <li>
                  <strong>Microsoft:</strong> Microsoft Clarity (com o seu aceite).
                </li>
                <li>
                  <strong>WhatsApp (Meta):</strong> quando você envia o formulário, a conversa continua por lá.
                </li>
              </ul>
              <p>
                Alguns desses serviços podem armazenar dados em servidores fora do Brasil. Nesses casos, a transferência
                segue as regras da LGPD (art. 33). Também podemos compartilhar dados quando a lei ou uma autoridade
                exigir.
              </p>
            </section>

            <section>
              <h2>6. Por quanto tempo guardamos</h2>
              <ul>
                <li>
                  <strong>Contatos do formulário:</strong> enquanto houver conversa ou relação comercial, e por até 2
                  anos depois do último contato, a menos que você peça a exclusão antes.
                </li>
                <li>
                  <strong>Dados de análise:</strong> pelo prazo de retenção de cada ferramenta (Google Analytics e
                  Microsoft Clarity).
                </li>
                <li>
                  <strong>Clientes:</strong> dados ligados a contratos e pagamentos podem ser guardados pelo tempo
                  exigido por lei.
                </li>
              </ul>
            </section>

            <section>
              <h2>7. Seus direitos</h2>
              <p>Pela LGPD (art. 18), você pode pedir a qualquer momento:</p>
              <ul>
                <li>a confirmação de que tratamos os seus dados e o acesso a eles;</li>
                <li>a correção de dados incompletos, errados ou desatualizados;</li>
                <li>a anonimização, o bloqueio ou a eliminação de dados desnecessários;</li>
                <li>a portabilidade dos dados para outro fornecedor;</li>
                <li>a informação sobre com quem compartilhamos os seus dados;</li>
                <li>a revogação do consentimento e a exclusão dos dados tratados com ele.</li>
              </ul>
              <p>
                É só falar com a gente pelo WhatsApp ou Instagram informados acima. Respondemos em até 15 dias. Se achar
                que os seus direitos não foram respeitados, você também pode procurar a Autoridade Nacional de Proteção
                de Dados (ANPD).
              </p>
            </section>

            <section>
              <h2>8. Cookies</h2>
              <p>
                Os cookies de análise só são ativados se você clicar em “Aceitar” no aviso de cookies. Você pode mudar a
                sua escolha quando quiser:
              </p>
              <p>
                <button type="button" className="pill pill--red privacy__cookies" onClick={openCookiePreferences}>
                  Preferências de cookies
                </button>
              </p>
              <p>Também dá para apagar ou bloquear cookies nas configurações do seu navegador.</p>
            </section>

            <section>
              <h2>9. Segurança</h2>
              <p>
                O site usa conexão criptografada (HTTPS). Os contatos ficam num sistema interno com acesso restrito por
                login e permissões por pessoa da equipe. Nenhum sistema é 100% invulnerável, mas tomamos cuidados para
                proteger os seus dados contra acessos não autorizados.
              </p>
            </section>

            <section>
              <h2>10. Menores de idade</h2>
              <p>
                O site e os nossos serviços são voltados a empresas e profissionais. Não coletamos de propósito dados de
                menores de 18 anos.
              </p>
            </section>

            <section>
              <h2>11. Mudanças nesta política</h2>
              <p>
                Esta política pode ser atualizada quando o site ou a lei mudarem. A data da última atualização fica
                sempre no topo da página.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
