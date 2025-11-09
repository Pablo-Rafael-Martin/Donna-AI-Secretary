import { calendar_v3 } from "googleapis";
import { initGoogleCalendar } from "./initGoogleCalendar.js";
import { MethodOptions } from "@googleapis/calendar";

interface ICreateEvent {
    params?: calendar_v3.Params$Resource$Events$Insert;
    options?: MethodOptions;
}

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

    const functionReturn = calendar.events.insert(argument.params, argument.options);

    return functionReturn;
}
