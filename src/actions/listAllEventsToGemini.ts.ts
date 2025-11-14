import { GoogleGenAI } from "@google/genai";
import { initGoogleCalendar } from "./initGoogleCalendar.js";
import { getAllEvents } from "./getAllEvents.js";

export async function listAllEventsToGemini(geminiAiInstance: GoogleGenAI) {
    const allEvents = await getAllEvents();

    const geminiResponse = await geminiAiInstance.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${allEvents}`,
    });
}
