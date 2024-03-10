import { getConversaciones } from "../Helpers/getConversaciones";

describe("getConversaciones", () => {

    let mensajeError = { "mensaje-error": "No hay mensajes" };

    // Mockear fetch
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () =>
                Promise.resolve([
                    { id: 1, remitente: 1, destinatario: 2, mensaje: "Hola" },
                    { id: 2, remitente: 2, destinatario: 1, mensaje: "Adios" },
                ]),
        })
    );

    test("Debería devolver los contactos", async () => {
        const conversaciones = await getConversaciones();
        expect(conversaciones).toEqual([
            { id: 1, remitente: 1, destinatario: 2, mensaje: "Hola" },
            { id: 2, remitente: 2, destinatario: 1, mensaje: "Adios" },
        ]);
    });
});
