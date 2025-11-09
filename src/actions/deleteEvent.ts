import { envConfig } from "../envs/envConfig.js";
import { initGoogleCalendar } from "./initGoogleCalendar.js";

export async function deleteEvent(eventId: string) {
    const calendar = await initGoogleCalendar();

    const deletedEvent = calendar.events.delete({
        calendarId: envConfig.calendarId,
        eventId: eventId,
    });

    return deletedEvent;
}
