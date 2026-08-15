import { useForm } from "@inertiajs/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import Swal from "sweetalert2";
import { suscribirPrivado } from "../Helpers/realtime";
import { AppContext } from "@/Components/AppProvider";

export const useConversacion = (userID, userDB) => {
    const { pulsarLed } = useContext(AppContext);
    const clasesLabel = "text-center mb-2 text-black select-none";
    const [csrf, setCSRF] = useState(null);
    const [userData, setUserData] = useState(null);
    const [conversacion, setConversacion] = useState([]);
    const userDataRef = useRef(userData);

    const { data, setData, post, errors, reset } = useForm({
        mensaje: "",
        destinatario_id: userID ?? "",
        _token: "",
    });

    async function getConversacion(idDestinatario) {
        try {
            const response = await fetch(
                route("recuperar_conversacion", { id: idDestinatario }),
                {
                    method: "GET",
                }
            );

            const datos = await response.json();
            return datos;
        } catch (error) {
            return { "mensaje-error": "No hay mensajes" };
        }
    }

    async function getUserInfo(id) {
        let url = `user/${id}/getInfo`;

        try {
            let response = await fetch(url);
            let data = await response.json();
            return data;
        } catch (error) {
            return { error };
        }
    }
    async function getData(userID) {
        const datos = await getUserInfo(userID);
        const texto = await getConversacion(userID);
        if (datos) {
            setUserData(datos);
            userDataRef.current = datos;
        }
        texto && setConversacion(texto);
        document.getElementById("conversacion").scrollTo(0, 0);
    }

    useEffect(() => {
        getData(userID);
        setTimeout(() => {
            data &&
                setData({
                    destinatario_id: data.id ?? userID,
                    _token: csrf,
                });
            document.getElementById("conversacion").scrollTo(0, 0);
        }, 200);
    }, []);

    const manejarNuevoMensaje = useCallback(
        (payload) => {
            if (payload.mensaje.remitente_id == userDB.id) return;

            const datosInterlocutor = userDataRef.current;

            const nuevoMensaje = {
                created_at: new Date().toISOString(),
                remitente_id: payload.mensaje.remitente_id,
                remitente: {
                    id: payload.mensaje.destinatario_id,
                    username: datosInterlocutor?.username,
                    photo: datosInterlocutor?.photo ?? "",
                    indicativo: datosInterlocutor?.indicativo ?? "",
                },
                id: payload.mensaje.id,
                destinatario_id: payload.mensaje.destinatario_id,
                mensaje: payload.mensaje.mensaje,
                destinatario: {
                    id: userDB.id,
                    username: userDB.username,
                    photo: userDB.photo ?? "",
                    indicativo: userDB?.indicativo ?? "",
                },
                updated_at: new Date().toISOString(),
            };

            // setState funcional para usar siempre la conversación actual.
            setConversacion((prev) => [nuevoMensaje, ...prev]);
            pulsarLed("msg");
        },
        [userDB.id, userDB.username, userDB.photo, userDB.indicativo, pulsarLed]
    );

    useEffect(() => {
        const ids = [data.destinatario_id, userDB.id].sort((a, b) => a - b);
        const nombreCanal = `canal-${ids[0]}-${ids[1]}-mensajes`;

        return suscribirPrivado(
            nombreCanal,
            "NuevoMensaje",
            manejarNuevoMensaje
        );
    }, [data.destinatario_id, userDB.id, manejarNuevoMensaje]);

    useEffect(() => {
        setData({
            destinatario_id: userID,
            _token: csrf,
        });
    }, [userID, csrf]);

    async function submit(e) {
        e.preventDefault();

        if (data.mensaje == "" || data.mensaje == undefined) return;

        const nuevoMensaje = {
            created_at: new Date().toISOString(),
            destinatario: {
                id: data.destinatario_id,
                username: userData.username,
                photo: userData?.photo ?? "",
                indicativo: userData?.indicativo ?? "",
            },
            destinatario_id: data.destinatario_id,
            id: null,
            mensaje: data.mensaje,
            remitente_id: userDB.id,
            remitente: {
                id: userDB.id,
                username: userDB.username,
                photo: userDB.photo ?? "",
                indicativo: userDB?.indicativo ?? "",
            },
            updated_at: new Date().toISOString(),
        };

        reset("mensaje");

        let nuevaConversacion = [nuevoMensaje, ...conversacion];
        setConversacion(nuevaConversacion);
        pulsarLed("tx");

        post(route("enviar_mensaje"), {
            onError: (errors) => {
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
                    icon: "error",
                    title: "Hubo un problema",
                });
                if (conversacion.length > 0) {
                    const nuevaConversacion = conversacion.slice(1);
                    setConversacion(nuevaConversacion);
                }
            },
        });
    }

    return {
        clasesLabel,
        conversacion,
        userData,
        data,
        setData,
        submit,
        errors,
        setCSRF,
        csrf,
    };
};
