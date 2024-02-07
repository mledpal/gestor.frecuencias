import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const handleContacts = ({
    post,
    borrarContacto,
    updateContact,
    handleOpen,
}) => {
    // Métodos / Hooks

    const MySwal = withReactContent(Swal);

    const crear = (e) => {
        e.preventDefault();
        post(route("contacto_crear"));
        updateContact();
        handleOpen();
    };

    function submit(e) {
        e.preventDefault();

        try {
            const idReg = parseInt(id.getAttribute("value"));
            const url = `ajax/contacto/${idReg}`;

            post(route("contacto_actualizar", { id: idReg }));

            // let response = getContactInfo(idReg);

            updateContact();

            Swal.fire({
                title: "Actualizado",
                text: "Contacto actualizado correctamente",
                icon: "success",
            });
        } catch (error) {
            Swal.fire({
                title: "No actualizado",
                text: "Hubo un error",
                icon: "warning",
            });
            console.error(error);
        }
    }

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

    const handleDelete = (id) => {
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
                    eliminar(id);
                    borrarContacto(id);

                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        },
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Contacto borrado",
                    });
                } else if (result.isDenied) {
                    Swal.fire("Cancelado", "", "info");
                }
            });
    };

    return {
        actualizar,
        crear,
        eliminar,
        submit,
        handleDelete,
    };
};
