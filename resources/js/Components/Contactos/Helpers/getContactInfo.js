export async function getContactInfo(id) {
    try {
        const url = `ajax/contacto/${id}`;
        console.log("URL : ", url);
        const response = await fetch(fetch(url), {
            method: "GET",
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Hubo un problema con la petición Fetch:", error.message);
        throw error;
    }
}
