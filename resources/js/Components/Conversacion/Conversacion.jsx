import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/Helpers/getUserInfo";
import { getConversacion } from "@/Helpers/getConversacion";
import { Mensaje } from "../Mensajes/Mensaje";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { BotonesFormulario } from "../BotonesFormulario/BotonesFormulario";

export const Conversacion = ({ handleOpenSendMessage, userID, userDB }) => {
    const clasesLabel = "text-center mb-2 text-black select-none";
    const csrf = document
        .querySelector('meta[id="meta_token"]')
        .getAttribute("content");

    const [userData, setUserData] = useState(null);
    const [conversacion, setConversacion] = useState([]);

    const { data, setData, post, errors, reset } = useForm({
        mensaje: "",
        destinatario_id: "",
        _token: "",
    });

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
        getData(userID);
        setTimeout(() => {
            // setData({
            //     destinatario_id: datos.id,
            //     token: csrf,
            // });
            document.getElementById("conversacion").scrollTo(0, 0);
        }, 200);
    }, []);

    useEffect(() => {
        setData({
            destinatario_id: userID,
            _token: csrf,
        });
    }, [conversacion]);

    async function getData(userID) {
        const datos = await getUserInfo(userID);
        const texto = await getConversacion(userID);
        setUserData(datos);
        setConversacion(texto);
        document.getElementById("conversacion").scrollTo(0, 0);
    }

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

    return (
        <div
            id="conversacion"
            className={`shadow-[0px_0px_15px_rgba(255,255,255,.5)]  max-h-screen h-screen overflow-y-auto w-2/4 flex flex-col items-center justify-between  rounded-xl m-auto`}
        >
            <header className="sticky top-0 h-50 w-full flex flex-col items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)]">
                {userData ? (
                    <div className="h-[75px] w-full flex flex-row gap-4 items-center justify-center">
                        <img
                            src={userData.photo}
                            className=" w-[70px] h-[70px] rounded-full"
                        />
                        <span className=" backdrop-blur-md">
                            {userData.username}
                        </span>
                    </div>
                ) : (
                    ""
                )}
            </header>

            <form
                name="conversacion"
                method="post"
                onSubmit={submit}
                encType="multipart/form-data"
                className="h-full w-full flex flex-col justify-between"
            >
                <input
                    name="destinatario_id"
                    type="hidden"
                    value={data.destinatario_id ?? ""}
                />

                <input name="_token" type="hidden" value={csrf ?? ""} />

                <main className="flex flex-col grow bg-gradient-to-br from-slate-800  to-gray-800 pb-5 ">
                    <div className=" sticky top-[131px] flex flex-col items-center justify-between px-4 gap-4 mt-4 bg-slate-800 ">
                        <div className="w-full">
                            <InputLabel
                                htmlFor="mensaje"
                                value="Escriba un mensaje"
                                className={clasesLabel}
                            />
                            <TextInput
                                id="mensaje"
                                name="mensaje"
                                value={data.mensaje ?? ""}
                                className="mt-1 block w-full text-center"
                                onChange={(e) =>
                                    setData("mensaje", e.target.value)
                                }
                                onSubmit={submit}
                                placeholder="mensaje"
                                autoComplete="off"
                            />
                            <InputError
                                message={errors.mensaje}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full flex flex-row items-center justify-end gap-3 p-4">
                            <BotonesFormulario
                                actionSubmit={submit}
                                actionReset={() => reset("mensaje")}
                                actionExit={() => handleOpenSendMessage(null)}
                            />
                        </div>
                    </div>

                    <article className="w-full text-center h-full p-4 flex flex-col items-center justify-start gap-2 ">
                        {conversacion
                            ? conversacion.map((msg, index) => {
                                  return (
                                      <span
                                          className="w-full  odd:bg-slate-800 even:bg-slate-700 "
                                          key={index}
                                      >
                                          <Mensaje datos={msg} />
                                      </span>
                                  );
                              })
                            : "No hay mensajes"}
                    </article>
                </main>

                {/* <footer className="sticky bottom-0 p-5 flex items-center justify-around h-15 bg-gradient-to-br from-blue-900 bg-slate-800 rounded-br-xl rounded-bl-xl font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)] "></footer> */}
            </form>
        </div>
    );
};
