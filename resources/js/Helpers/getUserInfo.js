export async function getUserInfo(id) {
    let url = `user/${id}/getInfo`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        return { error };
    }
}
