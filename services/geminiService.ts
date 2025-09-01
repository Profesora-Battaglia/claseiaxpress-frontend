// Interfaz simplificada para el objeto Chat.
// Esto asegura que nuestro objeto personalizado tenga el método que tus componentes esperan.
export interface Chat {
    sendMessage(message: string): Promise<string>;
}

/**
 * Una función genérica para generar contenido para diversas herramientas.
 * Llama a tu backend en Vercel para mayor seguridad.
 * @param prompt El prompt completo.
 * @returns El contenido de texto generado.
 */
export const generateContent = async (prompt: string): Promise<string> => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        if (!backendUrl) {
            throw new Error("URL del backend no configurada. Verifica las variables de entorno.");
        }

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error del servidor (${response.status}):`, errorText);
            
            if (response.status === 404) {
                throw new Error("El servicio de generación no está disponible. Verifica la configuración del backend.");
            } else if (response.status === 500) {
                throw new Error("Error interno del servidor. Intenta nuevamente en unos momentos.");
            } else {
                throw new Error(`Error del servidor: ${response.status} - ${response.statusText}`);
            }
        }

        const data = await response.json();
        
        if (!data.text) {
            console.error("Respuesta del servidor sin campo 'text':", data);
            throw new Error("Respuesta inválida del servidor.");
        }
        
        return data.text;
    } catch (error) {
        console.error("Error generando contenido:", error);
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet y la configuración del backend.");
        }
        
        throw error instanceof Error ? error : new Error("Error desconocido al generar contenido.");
    }
};

/**
 * Crea una nueva sesión de chat que se comunica con tu backend.
 * @returns Una nueva instancia de Chat.
 */
export const createChat = (): Chat => {
    // Devuelve un objeto que tiene un método `sendMessage`.
    // Este objeto simula el comportamiento del objeto `Chat` de la librería de Gemini.
    return {
        sendMessage: async (message: string): Promise<string> => {
            try {
                const chatUrl = import.meta.env.VITE_BACKEND_CHAT_URL;
                
                if (!chatUrl) {
                    throw new Error("URL del chat no configurada. Verifica las variables de entorno.");
                }

                const response = await fetch(chatUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error del servidor de chat (${response.status}):`, errorText);
                    
                    if (response.status === 404) {
                        throw new Error("El servicio de chat no está disponible. Verifica la configuración del backend.");
                    } else if (response.status === 500) {
                        throw new Error("Error interno del servidor de chat. Intenta nuevamente en unos momentos.");
                    } else {
                        throw new Error(`Error del servidor de chat: ${response.status} - ${response.statusText}`);
                    }
                }

                const data = await response.json();
                
                if (!data.text) {
                    console.error("Respuesta del chat sin campo 'text':", data);
                    throw new Error("Respuesta inválida del servidor de chat.");
                }
                
                return data.text;
            } catch (error) {
                console.error("Error enviando mensaje:", error);
                
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    throw new Error("No se pudo conectar con el servidor de chat. Verifica tu conexión a internet.");
                }
                
                throw error instanceof Error ? error : new Error("Error desconocido al enviar mensaje.");
            }
        }
    };
};
