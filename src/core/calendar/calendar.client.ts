import { google, Auth, calendar_v3 } from "googleapis";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PROJECT_ID,
    GOOGLE_PRIVATE_KEY,
} from "../../config/index.js";

const SCOPES = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"];

let calendar: calendar_v3.Calendar;

try {
    const credentials = {
        client_id: GOOGLE_CLIENT_ID,
        client_email: GOOGLE_CLIENT_EMAIL,
        project_id: GOOGLE_PROJECT_ID,
        private_key: (GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    };

    const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
    });

    calendar = google.calendar({ version: "v3", auth });
    console.log("Google Calendar API initialized.");

} catch (error) {
    console.error("Error initializing Google Calendar API:", error);
    throw new Error("Erro ao inicializar a API do Google Calendar.");
}

export { calendar };
