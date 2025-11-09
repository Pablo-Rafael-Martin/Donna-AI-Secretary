import { envConfig } from "../envs/envConfig.js";
import { initGoogleCalendar } from "./initGoogleCalendar.js";

export async function getEvent(eventId: string) {
    const calendar = await initGoogleCalendar();

    const specificEvent = await calendar.events.get({
        calendarId: envConfig.calendarId,
        eventId: eventId,
    });

    return specificEvent;
}
