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

### Atualizações do banco (rode na ordem, uma vez cada)

1. `supabase/02-equipe-e-pagamentos.sql` — Instagram no portfólio, CPF/CNPJ e pagamentos dos clientes, aba Funcionários.
2. `supabase/03-acessos-e-pagamentos-equipe.sql` — logins com permissões por área e pagamentos da equipe.

### Acessos (criar logins para outras pessoas)

Criar login precisa da chave secreta do Supabase, que **nunca** pode ir para o site. Por isso existe
uma função que roda no servidor do Supabase e só atende administradores:

1. No Supabase: **Edge Functions → Deploy a new function → Via Editor**.
2. Nome da função: `admin-users` (exatamente assim).
3. Apague o código de exemplo, cole todo o arquivo `supabase/functions/admin-users/index.ts` e clique em **Deploy**.
4. Pronto: a página **Acessos** do painel já funciona.
   Se aparecer "Invalid JWT", abra a função → **Details** → desligue **Enforce JWT verification** e salve
   (a própria função já confere quem está logado e se é administrador).

Tipos de login:
- **Administrador:** vê tudo e pode criar/bloquear/excluir outros logins.
- **Equipe:** vê só as áreas marcadas (Dashboard, Portfólio, Clientes, Funcionários). As regras do banco
  garantem isso — mesmo mexendo no site, a pessoa não consegue ler o que não foi liberado.

Cada pessoa pode trocar a própria senha em **Minha senha**, no topo do painel.

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
