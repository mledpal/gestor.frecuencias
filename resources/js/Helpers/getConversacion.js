export async function getConversacion(idDestinatario) {
    try {
        const response = await fetch(
            route("recuperar_conversacion", { id: idDestinatario }),
            {
                method: "GET",
            }
        );

        const datos = await response.json();
        return datos;
    } catch (error) {
        return { "mensaje-error": "No hay mensajes" };
    }
}
