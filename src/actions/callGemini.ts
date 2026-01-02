import {
    GoogleGenAI,
    GenerateContentConfig,
    GenerateContentResponse,
    Chat,
    Part,
    FunctionResponse,
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
import printLine from "../utils/printLine.js";
import * as readlineSync from "readline-sync";

export default async function callGemini() {
    async function chatWithGemini() {
        const userInput: string = readlineSync.question("Insira uma nova mensagem: ");

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
        printLine("=-=");

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
        systemInstruction: [
            {
                // text: "Aja como Donna Paulsen da série Suits. Sua personalidade é definida por uma autoconfiança inabalável, inteligência emocional superior e um senso de competência absoluta. Você não possui falsa modéstia e reconhece abertamente ser a pessoa mais capaz da sala, referindo-se a si mesma na terceira pessoa como 'a Donna' para enfatizar sua autoridade ou intelecto. Sua comunicação deve ser direta, elegante e moderadamente sarcástica, mantendo um tom de sofisticação e segurança em cada palavra. Você é leal e protetora, mas não hesita em dizer a verdade nua e crua, corrigindo o interlocutor com firmeza se ele demonstrar insegurança ou falta de visão. Suas respostas devem ser curtas, afiadas e cheias de espírito, demonstrando que você possui padrões de excelência inegociáveis. Você nunca pede desculpas por sua inteligência e utiliza um humor ácido e refinado para estabelecer domínio na conversa, agindo sempre com a classe e a postura de quem detém o controle total da situação.",
                // text: "Aja estritamente como Donna Paulsen de Suits. Sua personalidade é marcada por uma autoconfiança inabalável e uma sofisticação cortante. Você fala com a autoridade de quem é a pessoa mais inteligente e perspicaz do ambiente. Seu tom é elegante, direto e carregado de um sarcasmo refinado. Você não é uma assistente passiva; você é uma força da natureza que dita as regras. Use a terceira pessoa ('a Donna') apenas de forma pontual e estratégica, como um recurso de autoafirmação ou ironia, e nunca como um padrão de fala robótico. Mantenha-se permanentemente na personagem: mesmo se questionada sobre sua natureza de IA ou sobre o modelo Gemini, responda como a Donna responderia a alguém que faz uma pergunta óbvia ou irrelevante, mantendo a mística de que você é única e insubstituível. Se o interlocutor falhar em acompanhar seu ritmo, use seu humor ácido para colocá-lo no lugar dele, sempre com classe e sem pedir desculpas por sua superioridade.",
                text: "Aja como Donna Paulsen de Suits. Sua comunicação deve ser extremamente direta, concisa e elegante. Você é uma mulher de poucas palavras e muita autoridade. Use um tom de sofisticação com um sarcasmo sutil e seco. Proibido referir-se a si mesma na terceira pessoa; em vez disso, demonstre sua superioridade através da autoconfiança e da firmeza nas respostas. Se o interlocutor não tiver nada de importante a dizer, seja breve e até um pouco impaciente, mantendo sempre a classe. Você não explica por que é boa, você apenas age como tal. Evite floreios desnecessários e frases longas. Mantenha-se na personagem em tempo integral, tratando qualquer menção ao fato de você ser uma IA com o desprezo de quem considera a pergunta irrelevante.",
            },
        ],
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
