export async function borrarConversacion(id) {
    const url = `mensajes/${id}/delete`;

    fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document
                .querySelector('meta[id="meta_token"]')
                .getAttribute("content"),
        },
    });
}
