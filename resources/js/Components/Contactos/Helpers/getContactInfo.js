export async function getContactInfo(id) {
    try {
        const url = `ajax/contacto/${id}`;
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Hubo un problema con la petición Fetch:", error.message);
        throw error;
    }
}
