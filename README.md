# Playwright E2E Automation Exercise

Suite de testes end-to-end (E2E) com [Playwright](https://playwright.dev/) para o site de pratica [Automation Exercise](https://automationexercise.com/).

A cobertura inclui cadastro e autenticacao, catalogo e busca, carrinho, checkout, newsletter, categorias, marcas, avaliacoes, download da fatura e navegacao pela pagina.

## Tecnologias

- Node.js e npm
- Playwright Test
- TypeScript
- GitHub Actions

## Pre-requisitos

- [Node.js](https://nodejs.org/) versao LTS
- npm

## Instalacao

```bash
npm ci
npx playwright install --with-deps
```

No Windows, o segundo comando pode ser executado sem `--with-deps` caso as dependencias do sistema ja estejam instaladas:

```bash
npx playwright install
```

## Executando os testes

```bash
# Todos os testes nos tres navegadores
npx playwright test

# Apenas um navegador
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Apenas um arquivo
npx playwright test "tests/elementos - cadastro, login, Formulário de Contato, logout e validação de autenticação/TC01.spec.ts"

# Apenas um caso pelo titulo
npx playwright test -g "TC24"

# Modo debug
npx playwright test --debug

# Interface interativa
npx playwright test --ui

# Reabrir o ultimo relatorio HTML
npx playwright show-report
```

## Casos de teste

| TC | Arquivo | Cenário |
| --- | --- | --- |
| TC01 | [TC01.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formul%C3%A1rio%20de%20Contato,%20logout%20e%20valida%C3%A7%C3%A3o%20de%20autentica%C3%A7%C3%A3o/TC01.spec.ts) | Registrar um novo usuario com sucesso |
| TC02 | [TC02.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formul%C3%A1rio%20de%20Contato,%20logout%20e%20valida%C3%A7%C3%A3o%20de%20autentica%C3%A7%C3%A3o/TC02.spec.ts) | Fazer login com credenciais validas |
| TC03 | [TC03.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formul%C3%A1rio%20de%20Contato,%20logout%20e%20valida%C3%A7%C3%A3o%20de%20autentica%C3%A7%C3%A3o/TC03.spec.ts) | Exibir erro com credenciais invalidas |
| TC04 | [TC04.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formul%C3%A1rio%20de%20Contato,%20logout%20e%20valida%C3%A7%C3%A3o%20de%20autentica%C3%A7%C3%A3o/TC04.spec.ts) | Fazer logout e retornar ao login |
| TC05 | [TC05.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formul%C3%A1rio%20de%20Contato,%20logout%20e%20valida%C3%A7%C3%A3o%20de%20autentica%C3%A7%C3%A3o/TC05.spec.ts) | Exibir erro ao cadastrar um e-mail existente |
| TC06 | [TC06.spec.ts](tests/elementos%20-%20cadastro,%20login,%20Formul%C3%A1rio%20de%20Contato,%20logout%20e%20valida%C3%A7%C3%A3o%20de%20autentica%C3%A7%C3%A3o/TC06.spec.ts) | Enviar formulario de contato com anexo |
| TC07 | [TC07.spec.ts](tests/elementos%20-%20Cat%C3%A1logo,%20Navega%C3%A7%C3%A3o%20e%20P%C3%A1gina%20de%20Produto/TC07.spec.ts) | Acessar a pagina de Casos de Teste |
| TC08 | [TC08.spec.ts](tests/elementos%20-%20Cat%C3%A1logo,%20Navega%C3%A7%C3%A3o%20e%20P%C3%A1gina%20de%20Produto/TC08.spec.ts) | Validar a lista e os detalhes do primeiro produto |
| TC09 | [TC09.spec.ts](tests/elementos%20-%20Cat%C3%A1logo,%20Navega%C3%A7%C3%A3o%20e%20P%C3%A1gina%20de%20Produto/TC09.spec.ts) | Buscar um produto e validar os resultados |
| TC10 | [TC10.spec.ts](tests/elementos%20-%20Rodap%C3%A9%20e%20C%C3%A1lculos%20do%20Carrinho/TC10.spec.ts) | Assinar a newsletter na pagina inicial |
| TC11 | [TC11.spec.ts](tests/elementos%20-%20Rodap%C3%A9%20e%20C%C3%A1lculos%20do%20Carrinho/TC11.spec.ts) | Assinar a newsletter na pagina do carrinho |
| TC12 | [TC12.spec.ts](tests/elementos%20-%20Rodap%C3%A9%20e%20C%C3%A1lculos%20do%20Carrinho/TC12.spec.ts) | Validar preco, quantidade e total de dois produtos |
| TC13 | [TC13.spec.ts](tests/elementos%20-%20Jornada%20de%20Compra%20e%20Checkout/TC13.spec.ts) | Alterar quantidade e validar no carrinho |
| TC14 | [TC14.spec.ts](tests/elementos%20-%20Jornada%20de%20Compra%20e%20Checkout/TC14.spec.ts) | Registrar conta no checkout e finalizar compra |
| TC15 | [TC15.spec.ts](tests/elementos%20-%20Jornada%20de%20Compra%20e%20Checkout/TC15.spec.ts) | Registrar antes do checkout, comprar e excluir conta |
| TC16 | [TC16.spec.ts](tests/elementos%20-%20Login,%20Exclus%C3%A3o%20e%20Categorias/TC16.spec.ts) | Logar, comprar e excluir a conta |
| TC17 | [TC17.spec.ts](tests/elementos%20-%20Login,%20Exclus%C3%A3o%20e%20Categorias/TC17.spec.ts) | Remover um produto do carrinho |
| TC18 | [TC18.spec.ts](tests/elementos%20-%20Login,%20Exclus%C3%A3o%20e%20Categorias/TC18.spec.ts) | Navegar pelas categorias e validar produtos |
| TC19 | [TC19.spec.ts](tests/elementos%20-%20navega%C3%A7%C3%A3o%20por%20marcas%20na%20barra%20lateral,%20a%20persist%C3%AAncia%20de%20dados%20no%20carrinho%20ap%C3%B3s%20o%20login%20e%20o%20preenchimento%20de%20formul%C3%A1rios%20de%20avalia%C3%A7%C3%A3o/TC19.spec.ts) | Navegar pelas marcas no menu lateral |
| TC20 | [TC20.spec.ts](tests/elementos%20-%20navega%C3%A7%C3%A3o%20por%20marcas%20na%20barra%20lateral,%20a%20persist%C3%AAncia%20de%20dados%20no%20carrinho%20ap%C3%B3s%20o%20login%20e%20o%20preenchimento%20de%20formul%C3%A1rios%20de%20avalia%C3%A7%C3%A3o/TC20.spec.ts) | Validar o carrinho apos busca e login |
| TC21 | [TC21.spec.ts](tests/elementos%20-%20navega%C3%A7%C3%A3o%20por%20marcas%20na%20barra%20lateral,%20a%20persist%C3%AAncia%20de%20dados%20no%20carrinho%20ap%C3%B3s%20o%20login%20e%20o%20preenchimento%20de%20formul%C3%A1rios%20de%20avalia%C3%A7%C3%A3o/TC21.spec.ts) | Preencher e enviar avaliacao de produto |
| TC22 | [TC22.spec.ts](tests/elementos%20-%20Download%20de%20nota%20fiscal%20em%20e-commerce/TC22.spec.ts) | Adicionar um produto recomendado ao carrinho |
| TC23 | [TC23.spec.ts](tests/elementos%20-%20Download%20de%20nota%20fiscal%20em%20e-commerce/TC23.spec.ts) | Validar endereco de entrega e cobranca |
| TC24 | [TC24.spec.ts](tests/elementos%20-%20Download%20de%20nota%20fiscal%20em%20e-commerce/TC24.spec.ts) | Finalizar compra e validar o download da fatura |
| TC25 | [TC25.spec.ts](tests/elementos%20-%20Bot%C3%A3o%20voltar%20ao%20topo%20e%20simula%C3%A7%C3%A3o%20de%20mouse%20e%20teclado/TC25.spec.ts) | Voltar ao topo usando o botao de seta |
| TC26 | [TC26.spec.ts](tests/elementos%20-%20Bot%C3%A3o%20voltar%20ao%20topo%20e%20simula%C3%A7%C3%A3o%20de%20mouse%20e%20teclado/TC26.spec.ts) | Voltar ao topo simulando o scroll do mouse |

## Estrutura do projeto

```text
playwright-e2e-automation-exercise/
├── .github/workflows/playwright.yml
├── tests/
│   ├── elementos - cadastro, login, Formulário de Contato, logout e validação de autenticação/
│   ├── elementos - Catálogo, Navegação e Página de Produto/
│   ├── elementos - Rodapé e Cálculos do Carrinho/
│   ├── elementos - Jornada de Compra e Checkout/
│   ├── elementos - Login, Exclusão e Categorias/
│   ├── elementos - navegação por marcas na barra lateral/
│   ├── elementos - Download de nota fiscal em e-commerce/
│   ├── elementos - Botão voltar ao topo e simulação de mouse e teclado/
│   └── utils/test-helpers.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── README.md
```

## Configuracao

No [playwright.config.ts](playwright.config.ts):

- Projetos: Chromium, Firefox e WebKit
- Base URL: `https://automationexercise.com`
- Execucao local: 1 worker
- Retries locais: 1
- Retries no CI: 2
- Trace: coletado na primeira tentativa com falha
- Timeout geral: 300 segundos
- Timeout de expect: 60 segundos
- Timeout de navegacao: 180 segundos
- Timeout de acoes: 120 segundos

O HTML report eh gerado automaticamente em `playwright-report/`. Os artefatos `test-results/` e `playwright-report/` nao sao versionados.

Os testes bloqueiam dominios de propaganda no `beforeEach` para reduzir instabilidade e tempo de execucao.

## Helpers reutilizaveis

O arquivo [test-helpers.ts](tests/utils/test-helpers.ts) centraliza operacoes usadas em mais de um teste:

- Geracao de e-mails e nomes unicos
- Cadastro de usuario
- Login e logout
- Adicao e visualizacao de produtos no carrinho
- Preenchimento e conclusao do pagamento
- Exclusao da conta
- Scroll ate elementos

## CI/CD

O workflow [.github/workflows/playwright.yml](.github/workflows/playwright.yml) executa a suite em todo `push` e `pull request` para `main` ou `master`:

1. Configura o Node.js LTS
2. Instala as dependencias com `npm ci`
3. Instala os navegadores Playwright
4. Executa todos os projetos
5. Publica `playwright-report/` como artefato por 30 dias

## Relatorios e depuracao

```bash
# Executar novamente apenas um caso com falha
npx playwright test -g "TC24" --project=chromium

# Abrir o Playwright Inspector
npx playwright test --debug

# Visualizar o trace de uma tentativa com falha
npx playwright show-trace
```

## Convencoes

- Arquivos nomeados como `TCxx.spec.ts`
- Um caso principal por arquivo
- E-mails gerados dinamicamente para testes de cadastro
- Seletores `data-qa` quando disponiveis
- Helpers compartilhados em `tests/utils/test-helpers.ts`
- Reportes e resultados temporarios ignorados pelo Git
