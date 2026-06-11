import Pusher from "pusher-js";

/**
 * Crea un cliente Pusher configurado desde variables de entorno
 * (VITE_PUSHER_APP_KEY y VITE_PUSHER_APP_CLUSTER), evitando claves
 * hardcodeadas y duplicadas por toda la aplicación.
 */
export const crearPusher = () => {
    Pusher.logToConsole = false;

    return new Pusher(import.meta.env.VITE_PUSHER_APP_KEY ?? "", {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? "eu",
    });
};
