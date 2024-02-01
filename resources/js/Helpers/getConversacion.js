export async function getConversacion(idDestinatario) {
    const url = `mensajes/${idDestinatario}/recuperar`;

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        const datos = response.json();
        return datos;
    } catch (error) {
        return { "mensaje-error": "No hay mensajes" };
    }
}
