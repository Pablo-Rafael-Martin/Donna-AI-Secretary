// console.log("hello world");

import { createEvent } from "./actions/createEvent.js";
import { deleteEvent } from "./actions/deleteEvent.js";
import { getAllEvents } from "./actions/getAllEvents.js";
import { getEvent } from "./actions/getEvent.js";
import { initGoogleCalendar } from "./actions/initGoogleCalendar.js";
import { patchEvent } from "./actions/patchEvent.js";
import { envConfig } from "./envs/envConfig.js";

const allEvents = await getAllEvents();

const event1 = allEvents?.filter((item) => {
    return item.summary === "Evento 2";
});

const event1Id = event1?.[0].id;

if (event1Id) console.log(await deleteEvent(event1Id));

// const allEvents = await getAllEvents();

// allEvents?.map((item) => {
//     console.log(item.summary);
// });

// const eventCreated = await createEvent({
//     params: {
//         calendarId: envConfig.calendarId,
//         requestBody: {
//             start: {
//                 date: "2025-11-09",
//             },
//             end: {
//                 date: "2025-11-09",
//             },
//             summary: "testando createEvent (titulo)",
//             description: "testando createEvent (description)",
//         },
//     },
// });

// console.log(eventCreated);
