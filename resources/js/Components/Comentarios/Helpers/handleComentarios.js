import { router } from "@inertiajs/react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const handleComentarios = (updateComentarios) => {
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
            console.error(
                "Hubo un problema con la petición Fetch:",
                error.message
            );
            throw error;
        }
    };

    const deleteComentario = (id) => {
        const MySwal = withReactContent(Swal);

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
    };

    return {
        deleteComentario,
        getComentarios,
    };
};
