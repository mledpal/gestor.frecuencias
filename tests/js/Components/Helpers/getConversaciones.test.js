const {
    getConversaciones,
} = require("../../../../resources/js/Helpers/getConversaciones");

describe("Probando Fetch de Conversaciones", () => {
    jest.mock("/tests/js/Helpers/route.js", () => ({
        route: jest.fn((name) => {
            if (name === "todas_conversaciones") {
                return "/mensajes/recuperar";
            }
            // Manejar otros casos si es necesario
        }),
    }));

    test("Debe devolver un array vacío si no hay conversaciones", async () => {
        // Suponiendo que la función getConversaciones maneja la lógica de fetch
        const conversaciones = await getConversaciones();
        expect(conversaciones).toEqual([]);
    });

    // Prueba para manejar errores si es necesario
    test("Debe manejar errores correctamente", async () => {
        // Suponiendo que getConversaciones devuelve una promesa rechazada cuando hay un error
        await expect(getConversaciones()).rejects.toThrow("Mensaje de error");
    });
});
