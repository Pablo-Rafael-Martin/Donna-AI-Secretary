# Donna, sua secretária de IA

Este projeto é uma aplicação de linha de comando (CLI) que utiliza a IA do Google (Gemini) para atuar como uma secretária pessoal, gerenciando eventos no seu Google Calendar através de uma interface de chat conversacional.

## Instalação

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clone o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd automated-google-calendar-bot
```

### 2. Instale as Dependências

Este projeto utiliza Node.js e NPM. Certifique-se de que você os tem instalados e então execute:

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Para que a aplicação se conecte corretamente às APIs do Google, você precisa configurar suas credenciais.

Crie um arquivo chamado `.env` na raiz do projeto:

```bash
touch .env
```

Adicione as seguintes variáveis a este arquivo, substituindo os valores pelos suas próprias credenciais:

```env
# ID da sua agenda.
CALENDAR_ID=primary

# Chave de API do Google Gemini
GEMINI_API_KEY=SUA_CHAVE_GEMINI_AQUI

# Credenciais da Conta de Serviço do Google Cloud
# (necessário para autenticar com a API do Google Calendar)
GOOGLE_PROJECT_ID=SEU_PROJECT_ID
GOOGLE_PRIVATE_KEY_ID=SEU_PRIVATE_KEY_ID
GOOGLE_PRIVATE_KEY="SUA_CHAVE_PRIVADA_AQUI"
GOOGLE_CLIENT_ID=SEU_CLIENT_ID
GOOGLE_CLIENT_EMAIL=SEU_CLIENT_EMAIL
```

> **Nota:** A `GOOGLE_PRIVATE_KEY` geralmente contém quebras de linha (`\n`). Ao colar no arquivo `.env`, certifique-se de que a string esteja entre aspas, como no exemplo, para preservar a formatação.

## Como Executar

### Para Desenvolvimento

Este comando utiliza `ts-node` para executar o código TypeScript diretamente, ideal para desenvolvimento.

```bash
npm run dev
```

### Para Produção

Este comando primeiro compila o código TypeScript para JavaScript (`dist/`) e depois o executa.

```bash
# 1. Compilar o projeto
npm run build

# 2. Executar a versão compilada
npm run start
```

Após iniciar, a aplicação irá pedir sua mensagem no terminal para começar a interagir com a secretária.

---

## Estrutura do Projeto

A arquitetura deste projeto foi desenhada para ser modular, escalável e de fácil manutenção, aplicando o princípio da **Separação de Conceitos** (_Separation of Concerns_).

### Introdução à Arquitetura

A ideia principal é dividir o código em "camadas" com responsabilidades distintas. Em vez de misturar a lógica da IA com a lógica do Google Calendar, nós as separamos em módulos independentes.

-   **`core/`**: Contém a lógica de negócio principal e as integrações com serviços externos. É o "coração" da aplicação.
-   **`services/`**: Atua como uma ponte, orquestrando como as diferentes partes do `core` são expostas e utilizadas pela aplicação.
-   **`config/`**: Centraliza toda a configuração do projeto, como chaves de API e variáveis de ambiente.

Essa abordagem nos permite, por exemplo, adicionar uma nova integração (como Trello ou Asana) sem precisar modificar a lógica já existente do Calendar ou do Gemini.

Aqui está um detalhamento de cada diretório e arquivo principal dentro de `src/`:

-   **`src/index.ts`**

    -   **Propósito**: É o ponto de entrada da aplicação. Sua única responsabilidade é iniciar o serviço principal (`callGemini`).

-   **`src/config/index.ts`**

    -   **Propósito**: Carrega as variáveis de ambiente do arquivo `.env` e as exporta como constantes tipadas para serem usadas de forma segura no restante do projeto.

-   **`src/utils/`**

    -   **Propósito**: Contém funções utilitárias genéricas que podem ser reutilizadas em qualquer parte do sistema (ex: `printLine.ts`).

-   **`src/core/`**

    -   **`core/gemini/gemini.service.ts`**
        -   **Responsabilidade**: Orquestração da IA. Gerencia o chat com o Gemini, envia as mensagens do usuário, interpreta as respostas e decide quando chamar uma ferramenta externa. Ele não sabe _como_ as ferramentas funcionam, apenas que elas existem.
    -   **`core/calendar/`**
        -   **Responsabilidade**: Módulo dedicado exclusivamente à interação com a API do Google Calendar.
        -   `calendar.client.ts`: Configura e exporta um cliente autenticado da API do Google Calendar. É o único lugar que se preocupa com credenciais e autenticação.
        -   `calendar.service.ts`: Utiliza o cliente para expor funções de alto nível e com nomes claros (ex: `createEvent`, `deleteEvent`). É aqui que a lógica de CRUD (Create, Read, Update, Delete) para eventos reside.
    -   **`core/time/time.service.ts`**
        -   **Responsabilidade**: Fornece funções relacionadas ao tempo que podem ser usadas como ferramentas pela IA (ex: `getCurrentTime`).

-   **`src/services/tool.registry.ts`**
    -   **Propósito**: A "caixa de ferramentas" da IA.
    -   **Responsabilidade**: Importa as funções dos diferentes serviços do `core` (como `calendar.service` e `time.service`) e as registra como ferramentas disponíveis para o Gemini. Ele define o "contrato" (nome da função, descrição e parâmetros) que a IA pode chamar e sabe qual função do `core` executar para cada chamada.

### Conclusão da Arquitetura

Esta estrutura em camadas, embora possa parecer complexa para um projeto pequeno, oferece imensos benefícios a longo prazo:

-   **Manutenibilidade**: Se um detalhe da API do Google Calendar mudar, você só precisa atualizar o `core/calendar`, sem tocar no resto da aplicação.
-   **Testabilidade**: Cada "serviço" pode ser testado de forma isolada.
-   **Escalabilidade**: Adicionar uma nova funcionalidade ou integração (ex: um `core/trello/trello.service.ts`) torna-se um processo claro e padronizado: crie o serviço no `core` e registre suas funções no `tool.registry.ts`.
