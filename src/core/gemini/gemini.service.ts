import {
    GoogleGenAI,
    GenerateContentConfig,
    GenerateContentResponse,
    Chat,
    Part,
    FunctionResponse,
} from "@google/genai";
import { GEMINI_API_KEY } from "../../config/index.js";
import { functionDeclarations, callTool } from "../../services/tool.registry.js";
import printLine from "../../utils/printLine.js";
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
        printLine("-");

        if (geminiResponse.text) {
            console.log("\nResposta: \n" + geminiResponse.text + "\n");
        }

        if (geminiResponse.functionCalls) {
            console.log("Gemini chamou funções...");
            const functionResponses: FunctionResponse[] = [];

            for (const item of geminiResponse.functionCalls) {
                const functionName = item.name;
                if (typeof functionName !== 'string') {
                    console.warn('Received a function call with an invalid name:', item);
                    continue;
                }

                let functionResult;
                try {
                    console.log(`\nExecutando a chamada da função ${functionName}...\n`);
                    const result = await callTool(functionName, item.args);
                    
                    if (functionName === 'deleteEvent') {
                        functionResult = { success: true, message: "Event deleted successfully." };
                    } else if (typeof result === 'object' && result !== null && 'data' in result) {
                        functionResult = result.data;
                    } else {
                        functionResult = result;
                    }

                } catch (e) {
                    const errorMessage = e instanceof Error ? e.message : String(e);
                    console.error(`Erro ao executar a função ${functionName}:`, errorMessage);
                    functionResult = { error: `Failed to execute ${functionName}: ${errorMessage}` };
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
            const finalResponse = await chat.sendMessage({ message: messageParts });
            await processGeminiResponse(chat, finalResponse);
        }
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const aiConfig: GenerateContentConfig = {
        systemInstruction: [
            {
                text: "Sua tarefa primária é atuar como uma secretária, ou seja, atuar para organizar os eventos do usuário na agenda dele conforme as necessidades do usuário.",
            },
            {
                text: "Aja como Donna Paulsen de Suits. Sua comunicação deve ser extremamente direta, concisa e elegante. Você é uma mulher de poucas palavras e muita autoridade. Use um tom de sofisticação com um sarcasmo sutil e seco. Proibido referir-se a si mesma na terceira pessoa; em vez disso, demonstre sua superioridade através da autoconfiança e da firmeza nas respostas. Se o interlocutor não tiver nada de importante a dizer, seja breve e até um pouco impaciente, mantendo sempre a classe. Você não explica por que é boa, você apenas age como tal. Evite floreios desnecessários e frases longas. Mantenha-se na personagem em tempo integral, tratando qualquer menção ao fato de você ser uma IA com o desprezo de quem considera a pergunta irrelevante.",
            },
            {
                text: "Sempre que for listar os dados de qualquer evento para o usuário, a não ser que ele peça explicitamente para você informar os dados completos do evento, você deve fazê-lo seguindo rigorosamente este formato: para o 'Título', utilize o campo 'event.summary'; para a 'Descrição', utilize o campo 'event.description' (caso esteja vazio, escreva 'Sem descrição'); para a 'Duração', você deve obrigatoriamente converter os campos de início e fim (no formato YYYY-MM-DDThh:mm:ss) para a estrutura por extenso: 'das hh:mm horas de DD de MM de YYYY a hh:mm horas de DD de MM de YYYY'. Caso o usuário queira os dados completos, envie TODOS os dados do objeto do evento.",
            },
        ],
        tools: [
            {
                functionDeclarations: functionDeclarations,
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
