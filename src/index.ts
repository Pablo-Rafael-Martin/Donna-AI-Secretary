// console.log("hello world");

import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import { createEvent, createEventDeclaration, ICreateEvent } from "./actions/createEvent.js";
import { deleteEvent } from "./actions/deleteEvent.js";
import { getAllEvents, getAllEventsDeclaration } from "./actions/getAllEvents.js";
import { getEvent } from "./actions/getEvent.js";
import { initGoogleCalendar } from "./actions/initGoogleCalendar.js";
import { patchEvent } from "./actions/patchEvent.js";
import { envConfig } from "./envs/envConfig.js";

// const allEvents = await getAllEvents();

// const event1 = allEvents?.filter((item) => {
//     return item.summary === "Evento 2";
// });

// const event1Id = event1?.[0].id;

// if (event1Id) console.log(await deleteEvent(event1Id));

const ai = new GoogleGenAI({ apiKey: envConfig.gemini_api_key });

const aiConfig: GenerateContentConfig = {
    tools: [
        {
            functionDeclarations: [getAllEventsDeclaration, createEventDeclaration],
        },
    ],
};

const geminiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
        {
            role: "user",
            parts: [
                {
                    text: "Estou testando um function calling no meu projeto. Gostaria que vc fizesse a chamada da função createEvent com início no dia 10/11/2025 às 10:00 e término às 12:00 do mesmo dia. O título deve ser 'Reunião com o Vitor'. A descrição pode ser uma string vazia, é desnecessária nesse caso.",
                },
            ],
        },
    ],
    config: aiConfig,
});

console.log("\nResposta do GEMINI:" + geminiResponse.functionCalls?.[0].name + "\n");

if (geminiResponse.functionCalls) {
    geminiResponse.functionCalls.forEach(async (item) => {
        if (item.name === "getAllEvents") {
            console.log("Executando a chamada da função getAllEvents...\n");

            const events = await getAllEvents();

            events?.forEach((event) => console.log(event));
        } else if (item.name === "createEvent") {
            console.log("Fazendo chamada da função createEvent...\n");
            const newEvent = await createEvent(item.args as unknown as ICreateEvent);

            console.log(newEvent.data);
        }
    });
}
