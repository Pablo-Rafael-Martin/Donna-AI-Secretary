// console.log("hello world");

import { initGoogleCalendar } from "./actions/initGoogleCalendar.js";
import { envConfig } from "./envs/envConfig.js";

const calendarIstance = initGoogleCalendar();

const calendar = await calendarIstance;

const list = await calendar.events.list({
    calendarId: envConfig.calendarId,
});

console.log(list.data.items);
