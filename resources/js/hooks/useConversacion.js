import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import Pusher from "pusher-js";

// import withReactContent from "sweetalert2-react-content";
// import Echo from "laravel-echo";

export const useConversacion = (userID, userDB) => {
    const clasesLabel = "text-center mb-2 text-black select-none";
    const [csrf, setCSRF] = useState(null);
    const [userData, setUserData] = useState(null);
    const [conversacion, setConversacion] = useState([]);

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
        console.log(userID);
        const datos = await getUserInfo(userID);
        const texto = await getConversacion(userID);
        datos && setUserData(datos);
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

    useEffect(() => {
        Pusher.logToConsole = false;
        var pusher = new Pusher("5285b606cdf2c249808a", {
            cluster: "eu",
        });

        const ids = [data.destinatario_id, userDB.id].sort((a, b) => a - b);

        const ch2 = pusher.subscribe(`canal-${ids[0]}-${ids[1]}-mensajes`);

        ch2.bind("NuevoMensaje", function (data) {
            if (data.mensaje.remitente_id != userDB.id) {
                const nuevoMensaje = {
                    created_at: new Date().toISOString(),
                    remitente_id: data.mensaje.remitente_id,
                    remitente: {
                        id: data.mensaje.destinatario_id,
                        username: userData.username,
                        photo: userData?.photo ?? "",
                        indicativo: userData?.indicativo ?? "",
                    },
                    id: data.mensaje.id,
                    destinatario_id: data.mensaje.destinatario_id,
                    mensaje: data.mensaje.mensaje,
                    destinatario: {
                        id: userDB.id,
                        username: userDB.username,
                        photo: userDB.photo ?? "",
                        indicativo: userDB?.indicativo ?? "",
                    },
                    updated_at: new Date().toISOString(),
                };

                let nuevaConversacion = [nuevoMensaje, ...conversacion];

                setConversacion(nuevaConversacion);
            }
        });

        return () => {
            ch2.unbind();
            pusher.unsubscribe("canal-mensajes");
        };
    }, [conversacion]);

    useEffect(() => {
        setData({
            destinatario_id: userID,
            _token: csrf,
        });
    }, [conversacion]);

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

        // const realtime = new Ably.Realtime(
        //     "-n3DVQ.-Y01TA:OH0ZfLPH76pQ6rZGYmYgrGcKUC045Sel1JkGajojTUo"
        // );
        // const channel = realtime.channels.get("chatroom");
        // channel.publish("chatroom", data.mensaje);

        reset("mensaje");

        let nuevaConversacion = [nuevoMensaje, ...conversacion];
        setConversacion(nuevaConversacion);

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
