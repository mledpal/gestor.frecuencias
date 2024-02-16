import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const useBuscarUsuarios = ({
    handleOpenSendMessage,
    handleOpenBuscador,
    setUserID,
}) => {
    const [respuesta, setRespuesta] = useState(null);
    const [token, setToken] = useState(() =>
        document.getElementById("meta_token").getAttribute("content")
    );
    const classesLabel = "text-center mb-2 text-black select-none";
    const { data, setData, post, processing, errors, reset } = useForm({
        usuario: "",
        indicativo: "",
        localidad: "",
        provincia: "",
        _token: token,
    });

    useEffect(() => {
        const scrollToTop = () => {
            document.getElementById("buscarUsuario").scrollTo(0, 0);
        };
        setTimeout(scrollToTop, 200);
        setRespuesta(null);
    }, []);

    useEffect(() => {
        setData((prevData) => ({ ...prevData, _token: token }));
    }, [token]);

    const handleUserClicked = (e, id) => {
        e.preventDefault();
        handleOpenBuscador(null);
        setUserID(id);
        handleOpenSendMessage("xxl");
    };

    const searchUsers = async (data, token) => {
        try {
            const csrf = document
                .getElementById("meta_token")
                .getAttribute("content");
            const url = "user/busqueda?_token=" + (token || csrf);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": token || csrf,
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setToken(() =>
            document.getElementById("meta_token").getAttribute("content")
        );
        setRespuesta(null);
        const response = await searchUsers(data, token);
        setRespuesta(response);
        Swal.fire({
            icon: "success",
            title: "Búsqueda concluida",
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

    return {
        submit,
        handleUserClicked,
        classesLabel,
        data,
        setData,
        errors,
        reset,
        respuesta,
    };
};
