import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

export const useAdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState(null);

    const getUsers = () => {
        fetch(route("admin_usuarios"))
            .then((res) => res.json())
            .then((res) => setUsuarios(res))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        getUsers();
    }, []);

    const { setData, post } = useForm({
        id: null,
    });

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

    const swapAdmin = (id) => {
        setData({ id: id });
        post(route("usuario_swap_admin", { id: id }), {
            onSuccess: () => {
                getUsers();
                Swal.fire({
                    icon: "success",
                    title: "Cambio realizado",
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
            },
            onError: () => {
                msgError;
            },
        });
    };

    const deleteUser = (id) => {
        withReactContent(Swal)
            .fire({
                title: "¿Desea eliminar al usuario?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Si",
                denyButtonText: `No`,
                icon: "question",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    setData({ id: id });
                    fetch(`user/${id}/delete`, {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                            "X-CSRF-TOKEN":
                                document.head.querySelector("#meta_token")
                                    .content,
                        },
                        method: "DELETE",
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            mensajeOK("Usuario eliminado correctamente");
                            getUsers();
                        })
                        .catch((err) => {
                            mensajeError("Hubo un error");
                        });

                    // delete(route("usuario_eliminar", { id: id }),
                    // {
                    //     onSuccess: () => {
                    //         mensajeOK("Usuario eliminado correctamente");
                    //         getUsers();
                    //     },
                    //     onError: () => {
                    //         mensajeError("Hubo un error");
                    //     },
                    // });
                } else if (result.isDenied) {
                    Swal.fire("Cancelado", "", "info");
                }
            });
    };

    return {
        deleteUser,
        swapAdmin,
        usuarios,
    };
};
