# Playwright E2E Automation Exercise

Suíte de testes end-to-end (E2E) com [Playwright](https://playwright.dev/) sobre o site de prática [Automation Exercise](https://automationexercise.com/), cobrindo cadastro, login, validação de autenticação, logout, formulário de contato, navegação do catálogo, newsletter, cálculos do carrinho e jornada de compra/checkout.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) LTS (recomendado v20+; desenvolvido com v24)
- npm (vem junto com o Node.js)

## 🚀 Instalação

```bash
npm ci
npx playwright install --with-deps
```

O segundo comando baixa os navegadores (Chromium, Firefox e WebKit) usados pelos testes.

## ▶️ Executando os testes

```bash
# Todos os testes, todos os navegadores
npx playwright test

# Apenas um navegador
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Um único arquivo de teste
npx playwright test "tests/elementos - cadastro, login, Formulário de Contato, logout e validação de autenticação/TC01.spec.ts"

# Modo debug (abre o Playwright Inspector)
npx playwright test --debug

# Modo UI interativo
npx playwright test --ui
```

Após a execução, o relatório HTML é aberto automaticamente (configurado com `reporter: 'html'` em [playwright.config.ts](playwright.config.ts)). Para reabrir depois:

```bash
npx playwright show-report
```

## 🧪 Casos de teste

| Arquivo | Caso de teste | Descrição |
| --- | --- | --- |
| [TC01.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formulário%20de%20Contato,%20logout%20e%20validação%20de%20autenticação/TC01.spec.ts) | TC01 | Cadastro completo de novo usuário com sucesso |
| [TC02.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formulário%20de%20Contato,%20logout%20e%20validação%20de%20autenticação/TC02.spec.ts) | TC02 | Login com credenciais válidas |
| [TC03.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formulário%20de%20Contato,%20logout%20e%20validação%20de%20autenticação/TC03.spec.ts) | TC03 | Exibe erro ao logar com credenciais inválidas |
| [TC04.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formulário%20de%20Contato,%20logout%20e%20validação%20de%20autenticação/TC04.spec.ts) | TC04 | Logout retorna para a tela de login |
| [TC05.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formulário%20de%20Contato,%20logout%20e%20validação%20de%20autenticação/TC05.spec.ts) | TC05 | Exibe erro ao cadastrar e-mail já existente |
| [TC06.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formulário%20de%20Contato,%20logout%20e%20validação%20de%20autenticação/TC06.spec.ts) | TC06 | Formulário de contato com anexo de arquivo |
| [TC07.spec.ts](tests/elementos%20-%20Catálogo,%20Navegação%20e%20Página%20de%20Produto/TC07.spec.ts) | TC07 | Acessa a página de Casos de Teste (navegação/catálogo) |
| [TC08.spec.ts](tests/elementos%20-%20Catálogo,%20Navegação%20e%20Página%20de%20Produto/TC08.spec.ts) | TC08 | Valida a lista de produtos e os detalhes do primeiro item |
| [TC09.spec.ts](tests/elementos%20-%20Catálogo,%20Navegação%20e%20Página%20de%20Produto/TC09.spec.ts) | TC09 | Busca um produto ("Tshirt") e valida os resultados |
| [TC10.spec.ts](tests/elementos%20-%20Rodapé%20e%20Cálculos%20do%20Carrinho/TC10.spec.ts) | TC10 | Assina a newsletter na página inicial |
| [TC11.spec.ts](tests/elementos%20-%20Rodapé%20e%20Cálculos%20do%20Carrinho/TC11.spec.ts) | TC11 | Assina a newsletter na página do carrinho |
| [TC12.spec.ts](tests/elementos%20-%20Rodapé%20e%20Cálculos%20do%20Carrinho/TC12.spec.ts) | TC12 | Adiciona dois produtos e valida preço, quantidade e total no carrinho |
| [TC13.spec.ts](tests/elementos%20-%20Jornada%20de%20Compra%20e%20Checkout/TC13.spec.ts) | TC13 | Altera a quantidade do produto e valida no carrinho |
| [TC14.spec.ts](tests/elementos%20-%20Jornada%20de%20Compra%20e%20Checkout/TC14.spec.ts) | TC14 | Registra a conta durante o checkout e finaliza a compra |
| [TC15.spec.ts](tests/elementos%20-%20Jornada%20de%20Compra%20e%20Checkout/TC15.spec.ts) | TC15 | Registra antes do checkout, finaliza a compra e exclui a conta |

> ⚠️ Os testes de login/logout/cadastro repetido (TC02, TC04, TC05) usam a conta fixa `qa_tester_valido@teste.com`. Em um projeto real, essa conta seria criada via API antes da suíte (ex.: em um `global setup`), evitando dependência de estado externo.

## 🗂️ Estrutura do projeto

```text
playwright-e2e-automation-exercise/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI no GitHub Actions
├── tests/
│   ├── elementos - cadastro, login, Formulário de Contato, logout e validação de autenticação/
│   │   ├── TC01.spec.ts            # Cadastro completo
│   │   ├── TC02.spec.ts            # Login válido
│   │   ├── TC03.spec.ts            # Login inválido
│   │   ├── TC04.spec.ts            # Logout
│   │   ├── TC05.spec.ts            # E-mail já cadastrado
│   │   └── TC06.spec.ts            # Formulário de contato com anexo
│   ├── elementos - Catálogo, Navegação e Página de Produto/
│   │   ├── TC07.spec.ts            # Página de Test Cases
│   │   ├── TC08.spec.ts            # Lista de produtos e detalhes do item
│   │   └── TC09.spec.ts            # Busca de produto
│   ├── elementos - Rodapé e Cálculos do Carrinho/
│   │   ├── TC10.spec.ts            # Newsletter na home
│   │   ├── TC11.spec.ts            # Newsletter no carrinho
│   │   └── TC12.spec.ts            # Dois produtos: preço, quantidade e total
│   └── elementos - Jornada de Compra e Checkout/
│       ├── TC13.spec.ts            # Quantidade alterada e validada no carrinho
│       ├── TC14.spec.ts            # Cadastro durante o checkout + compra
│       └── TC15.spec.ts            # Cadastro antes + compra + exclusão da conta
├── .gitignore                      # node_modules, relatórios e artefatos
├── package.json
├── package-lock.json
├── playwright.config.ts
└── README.md
```

## ⚙️ Configuração

O arquivo [playwright.config.ts](playwright.config.ts) define:

- **Projetos**: `chromium`, `firefox` e `webkit` (Desktop Chrome/Firefox/Safari)
- **Execução paralela**: `fullyParallel: true` (arquivos rodam em paralelo localmente)
- **CI**: `forbidOnly` ativo, `retries: 2` e `workers: 1` quando `CI=true`
- **Relatório**: HTML (`reporter: 'html'`)
- **Trace**: gravado na primeira retry (`trace: 'on-first-retry'`) — útil para depurar falhas no CI

Cada spec bloqueia requisições de propaganda (`googleads`, `doubleclick`, `googlesyndication`) via `page.route` no `beforeEach`, deixando os testes mais rápidos e estáveis.

## 🤖 CI/CD (GitHub Actions)

O workflow [.github/workflows/playwright.yml](.github/workflows/playwright.yml) roda em todo `push`/`pull request` para `main`/`master`:

1. Faz checkout e configura o Node.js (LTS)
2. Instala dependências com `npm ci`
3. Instala os navegadores Playwright (`npx playwright install --with-deps`)
4. Executa `npx playwright test`
5. Publica o relatório HTML como artefato (`playwright-report`, retido por 30 dias)

## 🔄 O que mudou / histórico recente

- **TC06 adicionado**: formulário de contato com upload de anexo (`setInputFiles` com buffer gerado em memória) e tratamento do diálogo de confirmação (`page.on("dialog")`).
- **TC07 adicionado**: nova pasta `elementos - Catálogo, Navegação e Página de Produto` cobrindo navegação para a página de Test Cases.
- **TC08–TC15 adicionados**: detalhes de produto e busca (TC08–TC09), newsletter na home e no carrinho (TC10–TC11), validação de preço/quantidade/total com dois produtos (TC12), alteração de quantidade (TC13) e jornadas de compra com cadastro durante ou antes do checkout (TC14–TC15, com exclusão da conta ao final no TC15).
- **TC2.spec.ts → TC02.spec.ts**: o arquivo foi renomeado para padronizar a nomenclatura (zero à esquerda), mantendo o mesmo conteúdo do teste de login válido.
- **Commits anteriores**: TC01–TC05, configuração inicial do Playwright (3 navegadores), `package.json`/`package-lock.json`, `.gitignore` e workflow de CI.

## 📝 Convenções

- Testes nomeados como `TCxx.spec.ts`, um cenário por arquivo.
- Seletores baseados nos atributos `data-qa` fornecidos pelo site (mais estáveis que CSS/XPath).
- E-mails de teste gerados com timestamp (`qa_tester_${Date.now()}@teste.com`) para evitar colisão no cadastro (TC01).
