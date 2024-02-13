export async function searchUsers(data, token) {
    try {
        // post(route("usuario_busqueda"));

        let url = "user/busqueda?_token=" + token;

        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": token,
            },
            body: JSON.stringify(data),
        });

        let datos = await response.json();

        return datos;
    } catch (error) {
        console.error(error);
    }
}
