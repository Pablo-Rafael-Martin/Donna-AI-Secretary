# Automated Google Calendar Bot

This project provides an automated bot for interacting with Google Calendar.

## Installation

To get started with this project, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd Automated-Google-Calendar
    ```

2.  **Install dependencies:**
    This project uses `npm` for package management. Make sure you have Node.js and npm installed.
    ```bash
    npm install
    ```

## Configuration

This project uses `dotenv` for managing environment variables. You will need to create a `.env` file in the root directory of the project and add your Google API credentials and any other necessary configuration.

Example `.env` file:

```
CALENDAR_ID=
GOOGLE_PROJECT_ID=
GOOGLE_PRIVATE_KEY_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_CLIENT_EMAIL=
GOOGLE_CLIENT_ID=
GEMINI_API_KEY=
```

## Building the Project

To compile the TypeScript code into JavaScript, use the build script:

```bash
npm run build
```

This will output the compiled JavaScript files to the `dist` directory.

## Running the Project

You can run the project in two modes:

### Development Mode

For development, you can run the project directly using `ts-node` without prior compilation:

```bash
npm run dev
```

### Production Mode

For production, first build the project and then run the compiled JavaScript:

```bash
npm run start
```

# Sobre o projeto

Você, usuário, envia mensagens para o Gemini, e ele possui a autonomia de te responder com mensagens de texto ou com function call, dependendo da necessidade. O programa fica atento à resposta do gemini e executa as function calls quando necessário.
