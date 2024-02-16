import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

export const handleContacts = ({
    borrarContacto,
    handleOpen,
    updateContact,
    datos,
    setDatos,
    setVista,
    isSmallScreen,
}) => {
    // Métodos / Hooks
    let horaActual = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    let fechaActual = new Date().toISOString().split("T")[0];

    const [coordenadas, setCoordenadas] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        id: datos.id ?? null,
        frecuencia: datos.frecuencia.frecuencia ?? "",
        nombre: datos.nombre ?? "",
        observaciones: datos?.observaciones ?? "",
        comprobado: datos.comprobado ?? 0,
        privado: datos.privado ?? 0,
        frecuencia_id: datos.frecuencia_id ?? null,
        hora: datos?.hora ?? horaActual,
        fecha: datos?.fecha ?? fechaActual,
        tipo_id: datos?.tipo?.id ?? 1,
        banda_id: datos?.banda_id ?? 1,
        modo_id: datos.modo_id ?? -1,
        calidad: datos.calidad ?? 0,
        offset: datos.repetidor?.offset ?? "",
        direccion: datos.repetidor?.direccion ?? "=",
        codificacion_id: datos?.codificacion_id ?? -1,
        dcs_id: datos?.dcs_id ?? -1,
        ctcss_id: datos?.ctcss_id ?? -1,
        localizacion_id: datos.localizacion_id ?? null,
        localidad: datos.localizacion?.localidad ?? "",
        provincia: datos.localizacion?.provincia ?? "",
        pais: datos.localizacion?.pais ?? "",
        gps: datos.localizacion?.gps ?? "",
        favorito: datos.favorito ?? 0,
    });

    useEffect(() => {
        datos &&
            setData({
                id: datos.id ?? null,
                frecuencia: datos.frecuencia.frecuencia ?? "",
                nombre: datos.nombre ?? "",
                observaciones: datos?.observaciones ?? "",
                comprobado: datos.comprobado ?? 0,
                privado: datos.privado ?? 0,
                frecuencia_id: datos.frecuencia_id ?? null,
                hora: datos?.hora ?? horaActual,
                fecha: datos?.fecha ?? fechaActual,
                tipo_id: datos?.tipo?.id ?? 1,
                banda_id: datos.banda_id ?? 1,
                modo_id: datos.modo_id ?? -1,
                calidad: datos.calidad ?? 0,
                offset: datos.repetidor?.offset ?? "",
                direccion: datos.repetidor?.direccion ?? "=",
                codificacion_id: datos?.codificacion_id ?? -1,
                dcs_id: datos?.dcs_id ?? -1,
                ctcss_id: datos?.ctcss_id ?? -1,
                localizacion_id: datos.localizacion_id ?? null,
                localidad: datos.localizacion?.localidad ?? "",
                provincia: datos.localizacion?.provincia ?? "",
                pais: datos.localizacion?.pais ?? "",
                gps: datos.localizacion?.gps ?? "",
                favorito: datos.favorito ?? 0,
            });

        if (datos.localizacion?.gps) {
            let coords = datos.localizacion.gps.split(",");
            setCoordenadas(coords);
        }
    }, [datos]);

    /**
     * Tipos de aviso para el mensaje flotante
     */
    const tipo = {
        error: "error",
        ok: "success",
        aviso: "warning",
        info: "info",
    };

    /**
     * Función que crea un mensaje de aviso flotante
     * @param {} mensaje
     * @param {*} tipo
     */
    const mensaje = (mensaje, tipo) => {
        Swal.fire({
            icon: tipo,
            title: mensaje,
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
    };

    useEffect(() => {
        try {
            document.getElementById("detalle").scrollTo(0, 0);
        } catch (error) {
            // console.error(error);
        }
    }, [datos]);

    /**
     * Función para crear un nuevo contacto de forma asíncrona
     * @param {} e
     */
    async function crear(e) {
        e.preventDefault();
        post(route("contacto_crear"), {
            onSuccess: () => {
                updateContact();
                handleOpen();
                mensaje("Contacto creado correctamente", tipo.ok);
            },
            onError: () => {
                mensaje("Hubo un error", tipo.error);
            },
        });
    }

    /**
     * Función para crear un contacto en la vista móvil
     */
    const crearMovil = () => {
        post(route("contacto_crear"), {
            onSuccess: () => {
                mensaje("Contacto creado correctamente", tipo.ok);
                setVista(isSmallScreen ? "movil" : "main");
            },
            onError: (error) => {
                mensaje("Hubo un error", tipo.error);
                setVista(isSmallScreen ? "movil" : "main");
            },
        });
    };

    /**
     * Función para actualizar un contacto
     * @param {} e
     */
    function submit(e) {
        e.preventDefault();

        try {
            const idReg = parseInt(id.getAttribute("value"));

            post(route("contacto_actualizar", { id: idReg }), {
                onSuccess: () => {
                    updateContact(data);
                    mensaje("Contacto actualizado correctamente", tipo.ok);
                },
                onError: (errors) => {
                    mensaje("No actualizado", tipo.aviso);
                },
            });

            // let response = getContactInfo(idReg);
        } catch (error) {
            mensaje("Hubo un error", tipo.error);
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
                            mensaje("Contacto creado correctamente", tipo.ok);
                        },
                        onError: () => {
                            mensaje("Hubo un error", tipo.aviso);
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

                    mensaje("Contacto borrado", tipo.ok);
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
        crearMovil,
        eliminar,
        submit,
        handleDelete,
        handleAddContact,
        data,
        setData,
        coordenadas,
        errors,
    };
};
