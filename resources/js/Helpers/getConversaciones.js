export async function getConversaciones() {
    const url = "mensajes/recuperar";

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        const datos = await response.json();
        return datos;
        
    } catch (error) {
        return { "mensaje-error": "No hay mensajes" };
    }
}
