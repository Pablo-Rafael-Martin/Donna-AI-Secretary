import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
    calendarId: process.env.CALENDAR_ID,
    google_project_id: process.env.GOOGLE_PROJECT_ID,
    google_private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    google_private_key: process.env.GOOGLE_PRIVATE_KEY,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_email: process.env.GOOGLE_CLIENT_EMAIL,
    gemini_api_key: process.env.GEMINI_API_KEY,
};
