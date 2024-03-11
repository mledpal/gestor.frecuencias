import { getContactos } from "../../Helpers/getContactos";

describe("getContactos", () => {
    // Mockear fetch
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () =>
                Promise.resolve([
                    { id: 1, nombre: "40 Principales", frecuencia: "94.9" },
                    { id: 2, nombre: "Repetidor URE 1", frecuencia: "145.500" },
                    // Aquí puedes añadir más datos simulados según tu necesidad
                ]),
        })
    );

    test("Debería devolver los contactos", async () => {
        const contactos = await getContactos();
        expect(contactos).toEqual([
            { id: 1, nombre: "40 Principales", frecuencia: "94.9" },
            { id: 2, nombre: "Repetidor URE 1", frecuencia: "145.500" },
            // Asegúrate de que los datos devueltos sean los que esperas
        ]);
    });

    test("debería lanzar un error si la solicitud falla", async () => {
        // Mockear fetch para que devuelva un error
        global.fetch.mockImplementationOnce(() => Promise.reject("error"));

        await expect(getContactos()).rejects.toThrow(
            "No se pudo obtener los contactos"
        );
    });
});
