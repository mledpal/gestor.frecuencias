import { useContext, useEffect, useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { borrarConversacion } from "../helpers/borrarConversacion";
import { getConversaciones } from "@/Helpers/getConversaciones";
import { AppContext } from "@/Components/AppProvider";

export const useMensajes = ({
    handleOpenSendMessage,
    setUserID,
    setID,
}) => {
    const {
        setVista,
        isSmallScreen,
    } = useContext(AppContext);

    const [mensajes, setMensajes] = useState([]);

    async function getData() {
        let texto = await getConversaciones();
        setMensajes(texto);
    }


    /**
     * Borra una conversación
     * @param {*} e
     * @param {*} id
     */
    async function handleDeleteConversation(e, id) {
        e.preventDefault();

        withReactContent(Swal)
            .fire({
                title: "¿Desea eliminar la conversación?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Si",
                denyButtonText: `No`,
                icon: "question",
            })
            .then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    borrarConversacion(id);
                    getData();
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
                        title: "Conversación borrada",
                    });
                } else if (result.isDenied) {
                    Swal.fire("Cancelado", "", "info");
                }
            });
    }

    /**
     * Obtiene los mensajes
     */
    useEffect(() => {
        getData();
    }, []);

    /**
     * Función que maneja el evento de hacer click en un usuario
     * @param {*} e
     * @param {*} id
     */
    const handleUserClicked = (e, id) => {
        e.preventDefault();
        if (isSmallScreen) {
            setID(id);
            setVista("conversacion");
        } else {
            setUserID(id);
            handleOpenSendMessage("xxl");
        }
    };

    return {
        handleUserClicked,
        handleDeleteConversation,
        mensajes,
    };
};
