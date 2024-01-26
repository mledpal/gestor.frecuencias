export const getComentarios = async ({ frecuencia, localizacion }) => {
    const url = `/comentario/${frecuencia}/${localizacion}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Respuesta de red OK pero respuesta HTTP no OK");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Hubo un problema con la petición Fetch:", error.message);
        throw error;
    }
};
