export async function searchUsers(data) {
    try {
        // post(route("usuario_busqueda"));
        const token = document
            .getElementById("meta_token")
            .getAttribute("content");
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
