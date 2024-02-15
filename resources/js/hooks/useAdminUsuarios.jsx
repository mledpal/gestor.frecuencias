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

    const msgError = () => {
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
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    setData({ id: id });
                    post(route("usuario_eliminar", { id: id }), {
                        onSuccess: () => {
                            Swal.fire({
                                icon: "success",
                                title: "Contacto borrado",
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
                            getUsers();
                        },
                        onError: () => {
                            msgError();
                        },
                    });
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
