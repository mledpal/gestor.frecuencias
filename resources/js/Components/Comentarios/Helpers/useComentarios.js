import { router } from "@inertiajs/react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

// import Echo from "laravel-echo";
import Pusher from "pusher-js";

export const useComentarios = ({ datos }) => {
    const MySwal = withReactContent(Swal);
    const [comentarios, setComentarios] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        id: null,
        localizacion_id: datos?.localizacion_id,
        frecuencia_id: datos?.frecuencia_id,
        comentario: "",
    });

    const [editar, setEditar] = useState(null);

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

    /**
     * Función que recoge los comentarios según la frecuencia y la localización.
     * Esto es para que nos aseguremos de que sea el contacto adecuado.
     * @param {} param0
     * @returns
     */
    const getComentarios = async ({ frecuencia, localizacion }) => {
        const url = `/comentario/${frecuencia}/${localizacion}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(
                    "Respuesta de red OK pero respuesta HTTP no OK"
                );
            }

            const data = await response.json();
            return data;
        } catch (error) {
            mensaje("No se recuperaron mensajes", tipo.error);
            throw error;
        }
    };

    /**
     * Actualiza la lista de comentarios
     */
    const updateComentarios = () => {
        const fetchData = async () => {
            try {
                // Realizar la solicitud para obtener los comentarios
                const respuesta = await getComentarios({
                    frecuencia: datos.frecuencia_id,
                    localizacion: datos.localizacion_id,
                });

                // Verificar si se recibieron datos
                if (respuesta) {
                    setComentarios(respuesta);
                } else {
                    console.log("No se recibieron comentarios.");
                }
            } catch (error) {
                console.error("Error al obtener comentarios:", error);
            }
        };

        fetchData();
    };

    /**
     *  Creación de nuevos comentarios
     * @param {} e
     */
    const submit = (e) => {
        e.preventDefault();
        let ruta = null;
        if (editar) {
            ruta = route("comentario_editar", { id: data.id });
        } else {
            ruta = route("comentario_crear");
        }

        post(ruta, {
            onSuccess: () => {
                reset();
                updateComentarios();
                editar && mensaje("Comentario editado", tipo.ok);
            },
            onError: (errors) => {
                mensaje("No se envió el comentario", tipo.error);
            },
        });

        if (editar) setEditar(null);
    };

    /**
     * Elimina un comentario
     * @param {} id
     */
    const deleteComentario = (id) => {
        const MySwal = withReactContent(Swal);
        
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
                    router.delete(route("comentario_eliminar", { id: id }), {
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
                                title: "Comentario borrado",
                            });
                            updateComentarios();
                        },
                        onError: (error) => {
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
                                icon: "warning",
                                title: "No se pudo borrar",
                            });
                        },
                    });
                } else if (result.isDenied) {
                    Swal.fire("Cancelado", "", "info");
                }
            });
    };

    /**
     * Sistema para mensajería en tiempo real
     */
    useEffect(() => {
        Pusher.logToConsole = false;
        const pusher = new Pusher("5285b606cdf2c249808a", {
            cluster: "eu",
        });
        const channel = pusher.subscribe(
            `canal-${datos.frecuencia_id}-${datos.localizacion_id}-comentarios`
        );
        channel.bind("NuevoComentario", function (data) {
            updateComentarios();
        });
        return () => {
            channel.unbind();
            pusher.unsubscribe("canal-comentarios");
        };
    }, [comentarios]);

    useEffect(() => {
        setData({
            localizacion_id: datos?.localizacion_id,
            frecuencia_id: datos?.frecuencia_id,
            comentario: "",
        });
    }, [datos]);

    useEffect(() => {
        setEditar(false);
        updateComentarios();
    }, [datos]);

    return {
        submit,
        updateComentarios,
        getComentarios,
        deleteComentario,
        comentarios,
        setData,
        data,
        editar,
        setEditar,
        errors,
        reset,
    };
};
