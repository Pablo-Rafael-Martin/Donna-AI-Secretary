import { calendar_v3 } from "googleapis";
import { initGoogleCalendar } from "./initGoogleCalendar.js";
import { MethodOptions } from "@googleapis/calendar";
import { FunctionDeclaration, Type } from "@google/genai";
import { envConfig } from "../envs/envConfig.js";

export interface ICreateEvent {
    params: calendar_v3.Params$Resource$Events$Insert;
    options?: MethodOptions;
}

export const createEventDeclaration: FunctionDeclaration = {
    name: "createEvent",
    description:
        "Cria um novo evento no Google Calendar. Requer um objeto 'requestBody' contendo os detalhes do evento, especificamente 'summary', 'description', 'start' e 'end'.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            // O modelo deve preencher este objeto 'params'
            params: {
                type: Type.OBJECT,
                properties: {
                    // Dentro de 'params', o Google Calendar espera um 'requestBody' com os dados reais
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
                                description: "A data/hora de início do evento. Deve conter 'dateTime' OU 'date'.",
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
                                description: "A data/hora de término do evento. Deve conter 'dateTime' OU 'date'.",
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
                        required: ["summary", "start", "end"], // Definindo o que é absolutamente essencial
                    },
                    // Você pode adicionar 'calendarId' aqui se quiser permitir que o modelo escolha a agenda,
                    // mas geralmente é melhor deixar fixo no 'primary' ou na sua envConfig se for para o usuário atual.
                },
                required: ["requestBody"],
            },
        },
        required: ["params"],
    },
};

/**
 * Cria um evento na agenda.
 * @param {calendar_v3.Params$Resource$Events$Insert} params - os parâmetros necessários para criação do evento
 * @param {MethodOptions} options - sei lá o que é isso mas dá pra passar, dps descubro
 *
 * @example
 * Menor quantidade de informações para criar um evento
 * createEvent({
 *       params: {
 *           requestBody: {
 *               start: {
 *                   dateTime: "2025-10-31T09:00:00-03:00",
 *               },
 *               end: {
 *                   dateTime: "2025-10-31T12:00:00-03:00",
 *               },
 *               summary: "Título do evento",
 *               description: "Descrição curta do evento",
 *           },
 *       },
 *   });
 *
 *
 * @example
 * Também é possível criar um evento que dura um dia inteiro, para isso, basta usar usar a propriedade start.date ao invés de start.dateTime:
 *  createEvent({
 *       params: {
 *           requestBody: {
 *               start: {
 *                   date: "2025-11-09",
 *               },
 *               end: {
 *                   date: "2025-11-09",
 *               },
 *               summary: "Título do evento",
 *               description: "Descrição curta do evento",
 *           },
 *       },
 *   });
 */
export async function createEvent(argument: ICreateEvent) {
    const calendarPromise = initGoogleCalendar();

    const calendar = await calendarPromise;

    argument.params.calendarId = envConfig.calendarId;

    const functionReturn = calendar.events.insert(argument.params, argument.options);

    return functionReturn;
}
