// console.log("hello world");

import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import { createEvent, createEventDeclaration, ICreateEvent } from "./actions/createEvent.js";
import { deleteEvent } from "./actions/deleteEvent.js";
import { getAllEvents, getAllEventsDeclaration } from "./actions/getAllEvents.js";
import { getEvent } from "./actions/getEvent.js";
import { initGoogleCalendar } from "./actions/initGoogleCalendar.js";
import { patchEvent } from "./actions/patchEvent.js";
import { envConfig } from "./envs/envConfig.js";
import PromptSync from "prompt-sync";
import callGemini from "./actions/callGemini.js";

// const allEvents = await getAllEvents();

// const event1 = allEvents?.filter((item) => {
//     return item.summary === "Evento 2";
// });

// const event1Id = event1?.[0].id;

// if (event1Id) console.log(await deleteEvent(event1Id));

// const prompt = PromptSync();

// const userPromt = prompt("Hello world? ");

// console.log(userPromt);

callGemini();
