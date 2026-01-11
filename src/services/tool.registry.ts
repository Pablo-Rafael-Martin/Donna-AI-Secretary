import {
    createEvent,
    createEventDeclaration,
    deleteEvent,
    deleteEventDeclaration,
    getAllEvents,
    getAllEventsDeclaration,
    patchEvent,
    patchEventDeclaration,
} from "../core/calendar/calendar.service.js";
import {
    getCurrentTime,
    getCurrentTimeDeclaration,
} from "../core/time/time.service.js";

// Internal map of all available tools
const tools = {
    createEvent: {
        declaration: createEventDeclaration,
        function: createEvent,
    },
    deleteEvent: {
        declaration: deleteEventDeclaration,
        function: deleteEvent,
    },
    getAllEvents: {
        declaration: getAllEventsDeclaration,
        function: getAllEvents,
    },
    patchEvent: {
        declaration: patchEventDeclaration,
        function: patchEvent,
    },
    getCurrentTime: {
        declaration: getCurrentTimeDeclaration,
        function: getCurrentTime,
    },
};

// Export just the declarations for the Gemini config
export const functionDeclarations = Object.values(tools).map(tool => tool.declaration);

// Export a single function to handle all tool calls
export async function callTool(name: string, args: any) {
    switch (name) {
        case "getAllEvents":
        case "getCurrentTime":
            return await tools[name].function();

        case "deleteEvent":
            // The argument validation now happens here, in a centralized place
            if (typeof args?.eventId !== 'string') {
                throw new Error("O 'eventId' é obrigatório para a função deleteEvent e deve ser uma string.");
            }
            return await tools.deleteEvent.function(args.eventId);

        case "createEvent":
        case "patchEvent":
            return await tools[name].function(args);

        default:
            throw new Error(`Função desconhecida: ${name}`);
    }
}
