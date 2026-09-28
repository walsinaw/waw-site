# WAW Studio — site + painel

React + TypeScript + Vite. O site é público; o painel fica em **`/admin`**.

```bash
npm install
npm run dev     # http://localhost:5173  (painel: http://localhost:5173/admin)
npm run build   # versão final em /dist
```

## O que tem no painel (/admin)

- **Portfólio:** cria, edita, reordena e apaga projetos. Cada projeto tem capa, nome,
  especialidades, descrição curta e o que acontece ao clicar: **Behance**, **Site** (vai
  direto para o site do cliente) ou **Sem link**. "Na home" escolhe o que aparece na página
  inicial (até 6); todos os publicados aparecem em `/portfolio`.
- **Clientes:** mini-CRM com status (Lead → Proposta → Em andamento → Concluído / Pausado),
  valor, data de início e anotações. **Todo mundo que preenche o formulário do site entra
  aqui como Lead automaticamente** (além de abrir o WhatsApp).

Sem o Supabase configurado, o painel funciona em **modo demonstração** (dados salvos só no
seu navegador) — bom para testar, não para usar de verdade.

## Ligando o banco de verdade (Supabase, plano grátis)

1. Crie uma conta em https://supabase.com e um projeto novo (região: São Paulo).
2. No projeto: **SQL Editor → New query**, cole todo o arquivo `supabase/schema.sql` e clique em **Run**.
   Isso cria as tabelas, as regras de segurança, o espaço das imagens e os 4 projetos iniciais.
3. **Authentication → Users → Add user**: crie o seu usuário (e-mail + senha).
   Em **Authentication → Sign In / Providers**, desligue "Allow new users to sign up"
   para ninguém mais conseguir criar conta.
4. De volta ao **SQL Editor**, libere seu usuário como admin (troque o e-mail):
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'seu@email.com';
   ```
5. Em **Project Settings → API**, copie a *Project URL* e a *anon public key*.
   Copie `.env.example` para `.env` e cole os dois valores.
6. `npm run dev` de novo → entre em `/admin` com o e-mail e senha do passo 3.

Segurança: visitantes do site só conseguem **ler projetos publicados** e **criar leads**;
ler/editar clientes e mexer no portfólio exige estar logado **e** estar na tabela `admins`.

## Publicando

Funciona na Vercel ou na Netlify (já têm a configuração para as rotas `/admin` e `/portfolio`:
`vercel.json` e `public/_redirects`). Na hospedagem, cadastre as mesmas duas variáveis do `.env`.

## Onde mexer nos textos

- Textos fixos (serviços, "Por que WAW", processo, contatos): `src/data/content.ts`
- Seções: `src/components/`
- Cores e tamanhos base: topo de `src/styles/global.css`

## Fontes (importante)

`public/fonts/Cosmic-Regular.otf` é a versão **trial** da Cosmic: não tem acentos, ç,
parênteses etc., e a licença trial não permite uso em site publicado. Antes de colocar
no ar, compre a licença (a "Regular License" cobre web) e substitua o arquivo pelo
completo. Até lá, os caracteres que faltam aparecem na fonte Outfit.
Confira também a licença da Pirso (Habitype).
