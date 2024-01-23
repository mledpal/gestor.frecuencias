import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const handleContacts = ({ post, updateContact }) => {
    // Métodos / Hooks

    const MySwal = withReactContent(Swal);

    const crear = () => {
        post(route("contacto_crear"));
    };

    const submit = (e, id) => {
        e.preventDefault();
        try {
            post(route("contacto_actualizar", [(id) => id]));
            Swal.fire({
                title: "Actualizado",
                text: "Contacto actualizado correctamente",
                icon: "success",
            });
            updateContact();
        } catch (error) {
            Swal.fire({
                title: "No actualizado",
                text: "Hubo un error",
                icon: "warning",
            });
            console.error(error);
        }
    };

    const eliminar = (id) => {
        // Realiza la solicitud DELETE usando fetch
        fetch(`/contacto/${id}/eliminar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[id="meta_token"]')
                    .getAttribute("content"),
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const actualizar = (id) => {
        let url = "/ajax/contacto/" + id;

        fetch(url)
            .then(function (response) {
                if (response.ok) {
                    response.blob().then(function (miBlob) {
                        var objectURL = URL.createObjectURL(miBlob);
                        miImagen.src = objectURL;
                    });
                } else {
                    console.log(
                        "Respuesta de red OK pero respuesta HTTP no OK"
                    );
                }
            })
            .catch(function (error) {
                console.log(
                    "Hubo un problema con la petición Fetch:" + error.message
                );
            });
    };

    return {
        actualizar,
        crear,
        eliminar,
        submit,
    };
};
