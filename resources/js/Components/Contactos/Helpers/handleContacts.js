import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useEffect } from "react";

export const handleContacts = ({
    borrarContacto,
    handleOpen,
    updateContact,
    datos,
    post,
}) => {
    // Métodos / Hooks

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        document.getElementById("detalle").scrollTo(0, 0);
    }, [datos]);

    async function crear(e) {
        e.preventDefault();

        post(route("contacto_crear"), {
            onSuccess: () => {
                updateContact();
                handleOpen();
            },
        });
    }

    function submit(e) {
        e.preventDefault();

        try {
            const idReg = parseInt(id.getAttribute("value"));
            const url = `ajax/contacto/${idReg}`;

            post(route("contacto_actualizar", { id: idReg }), {
                onSuccess: () => {
                    updateContact();

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
                        title: "Contacto actualizado correctamente",
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        title: "No actualizado",
                        text: "Hubo un error",
                        icon: "warning",
                    });
                },
            });

            // let response = getContactInfo(idReg);
        } catch (error) {
            Swal.fire({
                title: "No actualizado",
                text: "Hubo un error",
                icon: "warning",
            });
            console.error(error);
        }
    }
    const handleAddContact = (e) => {
        e.preventDefault();
        // Tengo que mandar los datos a una ruta para crear el contacto.
        withReactContent(Swal)
            .fire({
                title: "¿Desea agregar el contacto?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Si",
                denyButtonText: `No`,
                icon: "question",
            })
            .then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    post(route("contacto_crear"), {
                        onSuccess: () => {
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
                                title: "Contacto creado",
                            });
                        },
                        onError: () => {
                            Swal.fire("Hubo un error", "", "warning");
                        },
                    });
                } else if (result.isDenied) {
                    Swal.fire("Cancelado", "", "info");
                }
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

    return {
        actualizar,
        crear,
        eliminar,
        submit,
        handleDelete,
        handleAddContact,
    };
};
