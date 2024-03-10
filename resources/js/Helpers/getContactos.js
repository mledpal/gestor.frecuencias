export async function getContactos() {
    try {
        const response = await fetch("ajax/contacto/get");
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("No se pudo obtener los contactos");
    }
}
