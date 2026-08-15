import Pusher from "pusher-js";

/**
 * Cliente Pusher único para toda la sesión: evita abrir una conexión
 * websocket nueva por cada componente que se monta (comentarios,
 * conversación, ...).
 */
let cliente = null;

/**
 * Canales privados ya suscritos, indexados por su nombre completo
 * (con el prefijo "private-"). Cada entrada lleva un contador de
 * referencias para no cancelar la suscripción de un canal que todavía
 * usa otro componente montado (p. ej. en StrictMode, que monta los
 * efectos dos veces).
 */
const canales = new Map();

/**
 * Lee el token CSRF en cada petición de autorización en vez de
 * capturarlo una sola vez: el cliente es un singleton que sobrevive a
 * la navegación Inertia, y el token puede rotar (p. ej. tras el login).
 */
const tokenCsrf = () =>
    document.getElementById("meta_token")?.getAttribute("content") ?? "";

const getPusher = () => {
    if (cliente) return cliente;

    Pusher.logToConsole = false;

    cliente = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY ?? "", {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? "eu",
        forceTLS: true,
        authEndpoint: "/broadcasting/auth",
        authorizer: (channel) => ({
            authorize: (socketId, callback) => {
                fetch("/broadcasting/auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "X-CSRF-TOKEN": tokenCsrf(),
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                    body: new URLSearchParams({
                        socket_id: socketId,
                        channel_name: channel.name,
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(
                                `Autorización de canal fallida (${response.status})`
                            );
                        }
                        return response.json();
                    })
                    .then((data) => callback(null, data))
                    .catch((error) => callback(error, null));
            },
        }),
    });

    return cliente;
};

/**
 * Se suscribe a un canal PRIVADO y liga un manejador a un evento,
 * compartiendo la conexión y la suscripción entre todos los
 * componentes que escuchen el mismo canal.
 *
 * @param {string} nombre - nombre del canal sin el prefijo "private-"
 * @param {string} evento
 * @param {(payload: unknown) => void} manejador
 * @returns {() => void} función de baja: debe llamarse en el cleanup
 */
export const suscribirPrivado = (nombre, evento, manejador) => {
    const pusher = getPusher();
    const clave = `private-${nombre}`;

    let entrada = canales.get(clave);
    if (!entrada) {
        entrada = { canal: pusher.subscribe(clave), refs: 0 };
        canales.set(clave, entrada);
    }

    entrada.refs += 1;
    entrada.canal.bind(evento, manejador);

    return () => {
        entrada.canal.unbind(evento, manejador);
        entrada.refs -= 1;

        if (entrada.refs <= 0) {
            pusher.unsubscribe(clave);
            canales.delete(clave);
        }
    };
};
