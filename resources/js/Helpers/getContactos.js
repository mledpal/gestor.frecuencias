export async function getContactos() {
    try {
        const response = await fetch("ajax/contacto/get");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener contactos:", error);
    }
}