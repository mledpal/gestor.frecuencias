import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export const useAdminTiposCodificacion = () => {
    const [tipos, setTipos] = useState();

    const { data, setData, reset, post, errors } = useForm({
        id: "",
        nombre: "",
    });

    const getTipos = () => {
        fetch(route("admin_tipos_codificacion"))
            .then((res) => res.json())
            .then((res) => setTipos(res))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        setTipos(getTipos());
    }, []);

    const mensajeOK = (mensaje) => {
        Swal.fire({
            icon: "success",
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

    const mensajeError = (error) => {
        Swal.fire({
            icon: "error",
            title: "Hubo un error",
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

    const submit = () => {
        if (data.id) {
            post(route("editar_tipo_codificacion", { id: data.id }), {
                onSuccess: () => {
                    getTipos();
                    mensajeOK("Tipo editado correctamente");
                    reset();
                },
                onError: (error) => {
                    mensajeError(error);
                },
            });
        } else {
            post(route("nuevo_tipo_codificacion"), {
                onSuccess: () => {
                    getTipos();
                    mensajeOK("Tipo agregado correctamente");
                    reset();
                },
                onError: (error) => {
                    mensajeError(error);
                },
            });
        }
    };

    const delTipo = (id) => {
        withReactContent(Swal)
            .fire({
                title: "¿Desea eliminar el tipo?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Si",
                denyButtonText: `No`,
                icon: "question",
            })
            .then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    fetch(`tipo_codificacion/${id}/eliminar`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN":
                                document.head.querySelector("#meta_token")
                                    .content,
                        },
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            getTipos();
                            mensajeOK("Tipo eliminado correctamente");
                        })
                        .catch((err) => {
                            mensajeError(err);
                        });
                } else if (result.isDenied) {
                    Swal.fire("Cancelado", "", "info");
                }
            });
    };

    const editTipo = (t) => {
        setData({ id: t.id, nombre: t.nombre });
    };

    return {
        editTipo,
        delTipo,
        submit,
        tipos,
        setData,
        data,
        errors,
        reset,
    };
};
