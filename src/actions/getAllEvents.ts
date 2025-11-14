import { FunctionDeclaration } from "@google/genai";
import { envConfig } from "../envs/envConfig.js";
import { initGoogleCalendar } from "./initGoogleCalendar.js";

export const getAllEventsDeclaration: FunctionDeclaration = {
    name: "getAllEvents",
    description: "Busca e retorna uma lista de todos os eventos do Google Calendar do usuário.",
    parameters: {
        type: undefined,
        properties: {},
        required: [],
    },
};

export async function getAllEvents() {
    const calendarPromise = initGoogleCalendar();

    const calendar = await calendarPromise;

    const eventsList = await calendar.events.list({
        calendarId: envConfig.calendarId,
    });

    return eventsList.data.items;
}
