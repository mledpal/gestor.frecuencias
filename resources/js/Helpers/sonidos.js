const fuentes = {
    entrada: "/assets/sound/click_in.mp3",
    salida: "/assets/sound/click_out.mp3",
};

const nodos = Object.fromEntries(
    Object.entries(fuentes).map(([tipo, ruta]) => [tipo, new Audio(ruta)])
);

/**
 * Reproduce un sonido de tecla clonando el nodo <audio> en cada llamada:
 * con un único Audio compartido, dos pulsaciones solapadas (frecuente al
 * escribir rápido) hacían que la segunda cortara a la primera.
 */
export const reproducirClick = (tipo) => {
    const nodo = nodos[tipo];
    if (!nodo) return;

    const copia = nodo.cloneNode();
    copia.play().catch(() => {});
};
