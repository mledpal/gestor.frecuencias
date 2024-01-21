import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const handleContacts = (post) => {
    // Métodos / Hooks

    const MySwal = withReactContent(Swal);

    const crear = (e) => {
        console.log('Creando contacto');
        e.preventDefault();
        post(route("contacto_crear"));
    };

    const submit = (e, id) => {
        e.preventDefault();
        post(route("contacto_actualizar", [(id) => id]));
    };

    const eliminar = (id) => {
        withReactContent(Swal)
            .fire({
                title: "¿Desea eliminar el contacto?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Si",
                denyButtonText: `No`,
                icon: "question",
            })
            .then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    deleteContact(id);
                    Swal.fire("Frecuencia borrada", "", "success");
                } else if (result.isDenied) {
                    Swal.fire("Cancelado", "", "info");
                }
            });
    };

    const deleteContact = (id) => {
        // Realiza la solicitud DELETE usando fetch
        fetch(`/contacto/${id}/eliminar`, {
            method: "DELETE",
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
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return {
        crear,
        eliminar,
        submit,
    };
};
