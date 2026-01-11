import { FunctionDeclaration, Type } from "@google/genai";

/**
 * Declaração da função para o Gemini
 */
export const getCurrentTimeDeclaration: FunctionDeclaration = {
    name: "getCurrentTime",
    description:
        "Retorna a data e a hora exatas do momento atual, no formato string ISO 8601 (incluindo fuso horário UTC 'Z'). Esta função NÃO aceita parâmetros. Deve ser usada como o 'agora' para calcular horários relativos (ex: 'daqui a 15 minutos', 'por 2 horas').",
    parameters: {
        type: Type.OBJECT,
        properties: {},
    },
};

/**
 * A implementação da função.
 * Retorna o 'agora' em formato ISO 8601.
 */
export function getCurrentTime() {
    const now = new Date();
    // .toISOString() converte para o formato padrão UTC (ex: "2025-11-15T23:00:00.000Z")
    // que o Gemini entende perfeitamente para cálculos.
    return now.toISOString();
}
