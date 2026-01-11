
import { calendar_v3 } from "googleapis";
import { MethodOptions } from "@googleapis/calendar";
import { FunctionDeclaration, Type } from "@google/genai";
import { CALENDAR_ID } from "../../config/index.js";
import { calendar } from "./calendar.client.js";

// --- Interfaces ---
export interface ICreateEvent {
    params: calendar_v3.Params$Resource$Events$Insert;
    options?: MethodOptions;
}

export interface IPatchEvent {
    eventId: string;
    patchParams: calendar_v3.Schema$Event;
}

// --- Function Declarations for Gemini ---

export const createEventDeclaration: FunctionDeclaration = {
    name: "createEvent",
    description:
        "Cria um novo evento no Google Calendar. Requer um objeto 'requestBody' que deve conter obrigatoriamente 'summary', 'start' e 'end'. O campo 'description' é opcional.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            params: {
                type: Type.OBJECT,
                properties: {
                    requestBody: {
                        type: Type.OBJECT,
                        description: "O corpo da requisição contendo os detalhes do evento.",
                        properties: {
                            summary: {
                                type: Type.STRING,
                                description: "O título ou resumo do evento.",
                            },
                            description: {
                                type: Type.STRING,
                                description: "Uma descrição detalhada do evento.",
                            },
                            location: {
                                type: Type.STRING,
                                description: "O local onde o evento ocorrerá (opcional).",
                            },
                            start: {
                                type: Type.OBJECT,
                                description:
                                    "A data/hora de início do evento. Deve conter 'dateTime' OU 'date'. Para eventos com hora marcada, utilize 'dateTime' no formato ISO (ex: '2023-10-31T09:00:00-03:00'), sendo **obrigatório** incluir o offset do fuso horário (padrão -03:00 para Londrina PR, a menos que especificado o contrário). Para eventos de dia inteiro, utilize 'date' no formato 'AAAA-MM-DD'. Importante: para eventos de dia inteiro, a 'date' de término ('end') deve ser o dia **SEGUINTE** ao último dia do evento.",
                                properties: {
                                    dateTime: {
                                        type: Type.STRING,
                                        description:
                                            "A data e hora de início no formato ISO (ex: '2023-10-31T09:00:00-03:00'). Use para eventos com hora marcada. É obrigatório ter o timezone no final. Como moro em Londrina PR, é sempre -3:00 a não ser que especificado o contrário",
                                        format: "date-time",
                                    },
                                    date: {
                                        type: Type.STRING,
                                        description:
                                            "A data de início no formato 'AAAA-MM-DD'. Use APENAS para eventos de dia inteiro.",
                                        format: "date",
                                    },
                                    timeZone: {
                                        type: Type.STRING,
                                        description:
                                            "O fuso horário da data de início (ex: 'America/Sao_Paulo'). Opcional se 'dateTime' já incluir o offset.",
                                    },
                                },
                            },
                            end: {
                                type: Type.OBJECT,
                                description:
                                    "A data/hora de término do evento. Deve conter 'dateTime' OU 'date'. Para eventos com hora marcada, utilize 'dateTime' no formato ISO (ex: '2023-10-31T09:00:00-03:00'), sendo **obrigatório** incluir o offset do fuso horário (padrão -03:00 para Londrina PR, a menos que especificado o contrário). Para eventos de dia inteiro, utilize 'date' no formato 'AAAA-MM-DD'. Importante: para eventos de dia inteiro, a 'date' de término ('end') deve ser o dia **SEGUINTE** ao último dia do evento.",
                                properties: {
                                    dateTime: {
                                        type: Type.STRING,
                                        description:
                                            "A data e hora de término no formato ISO (ex: '2023-10-31T10:00:00-03:00'). É obrigatório ter o timezone no final. Como moro em Londrina PR, é sempre -3:00 a não ser que especificado o contrário.",
                                        format: "date-time",
                                    },
                                    date: {
                                        type: Type.STRING,
                                        description:
                                            "A data de término no formato 'AAAA-MM-DD'. Para eventos de dia inteiro, deve ser o dia SEGUINTE ao último dia do evento.",
                                        format: "date",
                                    },
                                    timeZone: {
                                        type: Type.STRING,
                                        description: "O fuso horário da data de término.",
                                    },
                                },
                            },
                            attendees: {
                                type: Type.ARRAY,
                                description: "Lista de participantes do evento (opcional).",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        email: {
                                            type: Type.STRING,
                                            description: "O endereço de e-mail do participante.",
                                        },
                                    },
                                },
                            },
                        },
                        required: ["summary", "start", "end"],
                    },
                },
                required: ["requestBody"],
            },
        },
        required: ["params"],
    },
};

export const deleteEventDeclaration: FunctionDeclaration = {
    name: "deleteEvent",
    description:
        "Exclui um evento específico do Google Calendar. Esta função requer o 'eventId' (ID único) do evento a ser excluído. Para obter o 'eventId', utilize a função `getAllEvents()` para listar todos os eventos e identificar o desejado. **Importante:** Esta função pode ser utilizada de forma iterativa para excluir múltiplos eventos, inclusive todos os eventos da agenda do usuário, se combinada com `getAllEvents()` para obter e processar todos os IDs sequencialmente.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            eventId: {
                type: Type.STRING,
                description: "O ID do evento a ser excluído.",
            },
        },
        required: ["eventId"],
    },
};

export const getAllEventsDeclaration: FunctionDeclaration = {
    name: "getAllEvents",
    description:
        "Busca e retorna uma lista completa de todos os eventos do Google Calendar do usuário, incluindo seus IDs, resumos, datas/horas e outros detalhes relevantes. Esta função é fundamental para visualizar a agenda completa, bem como para obter os IDs de eventos necessários para operações como exclusão ou alteração.",
    parameters: {
        type: undefined,
        properties: {},
        required: [],
    },
};

export const patchEventDeclaration: FunctionDeclaration = {
    name: "patchEvent",
    description:
        "Altera campos específicos de um evento existente no Google Calendar. Requer o 'eventId' do evento a ser modificado e um objeto 'patchParams'. Este objeto deve conter **APENAS** os campos do evento que você deseja atualizar; campos não especificados em 'patchParams' permanecerão inalterados. Para obter o 'eventId', utilize a função `getAllEvents()` para listar e identificar o evento.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            eventId: {
                type: Type.STRING,
                description: "O ID do evento a ser alterado.",
            },
            patchParams: {
                type: Type.OBJECT,
                description: "Um objeto contendo os campos do evento a serem atualizados.",
                properties: {
                    summary: {
                        type: Type.STRING,
                        description: "O título ou resumo do evento.",
                    },
                    description: {
                        type: Type.STRING,
                        description: "Uma descrição detalhada do evento.",
                    },
                    location: {
                        type: Type.STRING,
                        description: "O local onde o evento ocorrerá.",
                    },
                    start: {
                        type: Type.OBJECT,
                        description:
                            "A data/hora de início do evento. Deve conter 'dateTime' OU 'date'. - Para eventos com hora marcada, utilize 'dateTime' no formato ISO (ex: '2023-10-31T09:00:00-03:00'), sendo **obrigatório** incluir o offset do fuso horário (padrão -03:00 para Londrina PR, a menos que especificado o contrário). Para eventos de dia inteiro, utilize 'date' no formato 'AAAA-MM-DD'. Importante: para eventos de dia inteiro, a 'date' de término ('end') deve ser o dia **SEGUINTE** ao último dia do evento.",
                        properties: {
                            dateTime: {
                                type: Type.STRING,
                                description:
                                    "A data e hora de início no formato ISO (ex: '2023-10-31T09:00:00-03:00'). Use para eventos com hora marcada. É obrigatório ter o timezone no final. Como moro em Londrina PR, é sempre -3:00 a não ser que especificado o contrário",
                                format: "date-time",
                            },
                            date: {
                                type: Type.STRING,
                                description:
                                    "A data de início no formato 'AAAA-MM-DD'. Use APENAS para eventos de dia inteiro.",
                                format: "date",
                            },
                            timeZone: {
                                type: Type.STRING,
                                description:
                                    "O fuso horário da data de início (ex: 'America/Sao_Paulo'). Opcional se 'dateTime' já incluir o offset.",
                            },
                        },
                    },
                    end: {
                        type: Type.OBJECT,
                        description:
                            "A data/hora de término do evento. Deve conter 'dateTime' OU 'date'. - Para eventos com hora marcada, utilize 'dateTime' no formato ISO (ex: '2023-10-31T09:00:00-03:00'), sendo **obrigatório** incluir o offset do fuso horário (padrão -03:00 para Londrina PR, a menos que especificado o contrário). Para eventos de dia inteiro, utilize 'date' no formato 'AAAA-MM-DD'. Importante: para eventos de dia inteiro, a 'date' de término ('end') deve ser o dia **SEGUINTE** ao último dia do evento.",
                        properties: {
                            dateTime: {
                                type: Type.STRING,
                                description:
                                    "A data e hora de término no formato ISO (ex: '2023-10-31T10:00:00-03:00'). É obrigatório ter o timezone no final. Como moro em Londrina PR, é sempre -3:00 a não ser que especificado o contrário.",
                                format: "date-time",
                            },
                            date: {
                                type: Type.STRING,
                                description:
                                    "A data de término no formato 'AAAA-MM-DD'. Para eventos de dia inteiro, deve ser o dia SEGUINTE ao último dia do evento.",
                                format: "date",
                            },
                            timeZone: {
                                type: Type.STRING,
                                description: "O fuso horário da data de término.",
                            },
                        },
                    },
                    attendees: {
                        type: Type.ARRAY,
                        description: "Lista de participantes do evento.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                email: {
                                    type: Type.STRING,
                                    description: "O endereço de e-mail do participante.",
                                },
                            },
                        },
                    },
                },
            },
        },
        required: ["eventId", "patchParams"],
    },
};


// --- Service Functions ---

/**
 * Creates an event in the calendar.
 * @param argument - The event creation parameters.
 */
export async function createEvent(argument: ICreateEvent) {
    argument.params.calendarId = CALENDAR_ID;
    return calendar.events.insert(argument.params, argument.options);
}

/**
 * Deletes an event from the calendar by its ID.
 * @param eventId - The ID of the event to delete.
 */
export async function deleteEvent(eventId: string) {
    return calendar.events.delete({
        calendarId: CALENDAR_ID,
        eventId: eventId,
    });
}

/**
 * Retrieves a list of all events from the calendar.
 */
export async function getAllEvents() {
    const eventsList = await calendar.events.list({
        calendarId: CALENDAR_ID,
    });
    return eventsList.data.items;
}

/**
 * Retrieves a specific event from the calendar by its ID.
 * @param eventId - The ID of the event to retrieve.
 */
export async function getEvent(eventId: string) {
    return await calendar.events.get({
        calendarId: CALENDAR_ID,
        eventId: eventId,
    });
}

/**
 * Updates specific fields of an existing event in the calendar.
 * @param eventId - The ID of the event to update.
 * @param patchParams - The event fields to update.
 */
export async function patchEvent({ eventId, patchParams }: IPatchEvent) {
    return calendar.events.patch({
        calendarId: CALENDAR_ID,
        eventId: eventId,
        requestBody: patchParams,
    });
}
