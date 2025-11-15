import {
    GoogleGenAI,
    GenerateContentConfig,
    GenerateContentResponse,
    Chat,
    Part, // O tipo da "Parte" da mensagem
    FunctionResponse, // O tipo da *resposta* da função
} from "@google/genai";
import { envConfig } from "../envs/envConfig.js";
import { createEventDeclaration, createEvent, ICreateEvent } from "./createEvent.js";
import { getAllEventsDeclaration, getAllEvents } from "./getAllEvents.js";
import PromptSync from "prompt-sync";

export default async function callGemini() {
    // Esta função está correta
    async function chatWithGemini() {
        const userInput: string = prompt("Insira uma nova mensagem: ");

        if (userInput === "exit") return "break";

        // Envia a mensagem do usuário (correto)
        const geminiResponse = await chat.sendMessage({
            message: userInput,
        });

        return geminiResponse;
    }

    async function processGeminiResponse(chat: Chat, geminiResponse: GenerateContentResponse) {
        if (geminiResponse.functionCalls) {
            console.log("Gemini chamou funções... \n");

            const functionResponses: FunctionResponse[] = [];

            for (const item of geminiResponse.functionCalls) {
                const functionName = item.name;
                let functionResult;

                if (functionName === "getAllEvents") {
                    console.log("Executando a chamada da função getAllEvents...\n");
                    const events = await getAllEvents();
                    functionResult = events || [];
                } else if (functionName === "createEvent") {
                    console.log("Fazendo chamada da função createEvent...\n");
                    const newEvent = await createEvent(item.args as unknown as ICreateEvent);
                    functionResult = newEvent.data;
                }

                if (functionResult !== undefined) {
                    functionResponses.push({
                        name: functionName,
                        response: { output: functionResult },
                    });
                }
            }

            const messageParts: Part[] = functionResponses.map((resp) => ({
                functionResponse: resp,
            }));

            console.log("Enviando resultados das funções para o Gemini...\n");

            const finalResponse = await chat.sendMessage({
                message: messageParts,
            });

            if (finalResponse.text) {
                console.log("\nResposta: \n" + finalResponse.text + "\n");
            }
        } else if (geminiResponse.text) {
            console.log("\nResposta: \n" + geminiResponse.text + "\n");
        }
    }

    // --- Configuração Inicial (Correta) ---
    const ai = new GoogleGenAI({ apiKey: envConfig.gemini_api_key });

    const aiConfig: GenerateContentConfig = {
        tools: [
            {
                functionDeclarations: [getAllEventsDeclaration, createEventDeclaration],
            },
        ],
    };

    const prompt = PromptSync();

    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: [],
        config: aiConfig,
    });

    console.log("Chat iniciado. Digite 'exit' para sair.\n");

    // --- Loop Principal (Correto) ---
    while (true) {
        const geminiReturn = await chatWithGemini();

        if (geminiReturn === "break") break;

        await processGeminiResponse(chat, geminiReturn);
    }
}
