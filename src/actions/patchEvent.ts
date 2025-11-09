import { calendar_v3 } from "googleapis";
import { envConfig } from "../envs/envConfig.js";
import { getEvent } from "./getEvent.js";
import { initGoogleCalendar } from "./initGoogleCalendar.js";

/**
 * Altera os dados de um evento na agenda
 *
 * @param eventId - A id do evento a ser alterado
 * @param patchParams - Os parâmetros do evento a serem alterados
 *
 * Para mais informações da estrutura do evento, acesse: https://developers.google.com/workspace/calendar/api/v3/reference/events?hl=pt-br#resource
 */
export async function patchEvent(eventId: string, patchParams: calendar_v3.Schema$Event) {
    const calendar = await initGoogleCalendar();

    const patchedEvent = calendar.events.patch({
        calendarId: envConfig.calendarId,
        eventId: eventId,
        requestBody: patchParams,
    });

    return patchedEvent;
}
