export async function getConversaciones() {
    const url = route("todas_conversaciones");

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
