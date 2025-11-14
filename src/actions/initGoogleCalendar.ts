import { google, Auth, calendar_v3 } from "googleapis";
import { envConfig } from "../envs/envConfig.js";

const SCOPES = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"];

export const initGoogleCalendarFunctionDeclaration = {
    name: "init_google_calendar",
    description: "Cria uma nova instância autenticada da agenda.",
};

export const initGoogleCalendar = async (): Promise<calendar_v3.Calendar> => {
    try {
        const credentials = {
            client_id: envConfig.google_client_id,
            client_email: envConfig.google_client_email,
            project_id: envConfig.google_project_id,
            private_key: envConfig.google_private_key,
        };

        const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: SCOPES,
        });

        const calendar = google.calendar({ version: "v3", auth });

        console.log("Google Calendar API initialized:");
        return calendar;
    } catch (error) {
        console.error("Error initializing Google Calendar API:", error);
        throw new Error("Deu rim");
    }
};
