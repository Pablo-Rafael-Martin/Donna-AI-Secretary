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
import { initGoogleCalendar } from "./initGoogleCalendar.js";
import { deleteEvent, deleteEventDeclaration } from "./deleteEvent.js";
import { patchEvent, patchEventDeclaration } from "./patchEvent.js";
import { calendar_v3 } from "googleapis";
import { getCurrentTime, getCurrentTimeDeclaration } from "./getCurrentTime.js";

export default async function callGemini() {
    async function chatWithGemini() {
        const userInput: string = prompt("Insira uma nova mensagem: ");

        if (!userInput) return null;

        if (userInput.trim() === "exit") return "break";

        if (userInput.toLowerCase() === "clear") {
            console.clear();
            return "cleared";
        }

        const geminiResponse = await chat.sendMessage({
            message: userInput,
        });

        return geminiResponse;
    }

    async function processGeminiResponse(chat: Chat, geminiResponse: GenerateContentResponse) {
        console.log("***************************************************************");

        if (geminiResponse.text) {
            /**
             *
             *
             * Se a ersposta for texto:
             */
            console.log("\nResposta: \n" + geminiResponse.text + "\n");
        }
        if (geminiResponse.functionCalls) {
            /**
             *
             *
             * Se a resposta for uma chamada de função:
             */
            console.log("Gemini chamou funções...");

            const functionResponses: FunctionResponse[] = [];

            for (const item of geminiResponse.functionCalls) {
                const functionName = item.name;
                let functionResult;

                if (functionName === "getAllEvents") {
                    console.log("\nExecutando a chamada da função getAllEvents...\n");
                    const events = await getAllEvents(calendar);
                    functionResult = events || [];
                } else if (functionName === "createEvent") {
                    console.log("\nFazendo chamada da função createEvent...\n");
                    const newEvent = await createEvent(item.args as unknown as ICreateEvent, calendar);
                    functionResult = newEvent.data;
                } else if (functionName === "deleteEvent") {
                    console.log("\nExecutando a função deleteEvent...\n");
                    const deletedEvent = await deleteEvent(item.args?.eventId as unknown as string, calendar);
                    functionResult = deletedEvent.data;
                } else if (functionName === "patchEvent") {
                    console.log("\nExecutando a função patchEvents...\n");
                    const patchedEvent = await patchEvent({
                        eventId: item.args?.eventId as unknown as string,
                        patchParams: item.args?.patchParams as unknown as calendar_v3.Schema$Event,
                        calendar: calendar,
                    });
                    functionResult = patchedEvent.data;
                } else if (functionName === "getCurrentTime") {
                    console.log("\nEnviando a data e horário atuais...\n");
                    const currentTime = getCurrentTime();
                    functionResult = currentTime;
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

            // Esta recursão permite a chamada constante de funções até o gemini enviar apena uma mensagem de texto como mensagem
            await processGeminiResponse(chat, finalResponse);
        }
    }

    const ai = new GoogleGenAI({ apiKey: envConfig.gemini_api_key });

    const calendar = await initGoogleCalendar();

    const aiConfig: GenerateContentConfig = {
        tools: [
            {
                functionDeclarations: [
                    getAllEventsDeclaration,
                    createEventDeclaration,
                    deleteEventDeclaration,
                    patchEventDeclaration,
                    getCurrentTimeDeclaration,
                ],
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

    while (true) {
        const geminiReturn = await chatWithGemini();

        if (!geminiReturn) continue;

        if (geminiReturn === "break") break;

        if (geminiReturn === "cleared") continue;

        await processGeminiResponse(chat, geminiReturn);
    }
}
