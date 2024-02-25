import "whatwg-fetch";
import { jest } from "@jest/globals";
import { route } from "./tests/js/Helpers/route";

// Creamos un mock para la función route
jest.mock("./tests/js/Helpers/route", () => ({
    route: jest.fn((name) => {
        if (name === "todas_conversaciones") {
            return "/mensajes/recuperar";
        }
    }),
}));

