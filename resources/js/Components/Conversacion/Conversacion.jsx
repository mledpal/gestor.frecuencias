import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

import { useForm } from "@inertiajs/react";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/Helpers/getUserInfo";
import { getConversacion } from "@/Helpers/getConversacion";
import { Mensaje } from "../Mensajes/Mensaje";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

export const Conversacion = ({ handleOpenSendMessage, userID }) => {
    const clasesLabel = "text-center mb-2 text-black select-none";

    const [userData, setUserData] = useState(null);
    const [conversacion, setConversacion] = useState(null);
    const [csrf, setCSRF] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        mensaje: "",
        destinatario_id: "",
        _token: "",
    });

    // useEffect(() => {
    //     const realtime = new Ably.Realtime(
    //         "-n3DVQ.-Y01TA:OH0ZfLPH76pQ6rZGYmYgrGcKUC045Sel1JkGajojTUo"
    //     );
    //     const channel = realtime.channels.get("chatroom");

    //     channel.attach();

    //     function handleDetached() {
    //         console.log("Detached from the channel " + channel.name);
    //     }

    //     channel.on("detached", handleDetached);

    //     return () => {
    //         channel.off("detached", handleDetached);
    //         channel.detach();
    //     };
    // }, []);

    useEffect(() => {
        Pusher.logToConsole = true;

        var pusher = new Pusher("5285b606cdf2c249808a", {
            cluster: "eu",
        });

        var channel = pusher.subscribe("canal-mensajes");
        channel.bind("App\\Events\\NuevoMensaje", function (data) {
            getData();
        });
    }, [conversacion]);

    useEffect(() => {
        setData({
            destinatario_id: userData?.id,
            _token: csrf,
        });
    }, [conversacion]);

    useEffect(() => {
        getData(userID);

        setCSRF(
            document
                .querySelector('meta[id="meta_token"]')
                .getAttribute("content")
        );

        setTimeout(() => {
            setData({
                destinatario_id: datos.id,
                token: csrf,
            });
            document.getElementById("conversacion").scrollTo(0, 0);
        }, 100);

        let datos = getUserInfo(userID);
        setUserData(datos);
    }, []);

    async function getData(userID) {
        const datos = await getUserInfo(userID);
        const texto = await getConversacion(userID);
        setUserData(datos);
        setConversacion(texto);
        document.getElementById("conversacion").scrollTo(0, 0);
    }

    async function submit(e) {
        e.preventDefault();

        // const realtime = new Ably.Realtime(
        //     "-n3DVQ.-Y01TA:OH0ZfLPH76pQ6rZGYmYgrGcKUC045Sel1JkGajojTUo"
        // );
        // const channel = realtime.channels.get("chatroom");
        // channel.publish("chatroom", data.mensaje);

        reset("mensaje");

        post(route("enviar_mensaje"), {
            onSuccess: () => {
                getData(data.destinatario_id);
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    return (
        <div
            id="conversacion"
            className={`shadow-[0px_0px_15px_rgba(255,255,255,.5)]  max-h-screen h-screen overflow-y-auto w-1/4 flex flex-col items-center justify-between  rounded-xl m-auto`}
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
                        <div className="w-full flex flex-row items-center justify-between p-4">
                            <Button
                                variant="gradient"
                                color="blue"
                                onClick={submit}
                                className="border-[1px] p-2 max-w-screen-desktop:hover:scale-110 hover:scale-100 bg-blue-700 text-white duration-200 ease-in-out max-w-screen-desktop:scale-100 scale-75"
                            >
                                <span>
                                    Enviar{" "}
                                    <i className="fa-solid fa-paper-plane"></i>
                                </span>
                            </Button>
                            <Button
                                variant="text"
                                color="light-green"
                                onClick={() => reset("mensaje")}
                                className="border-[1px] p-2 max-w-screen-desktop:hover:scale-110 hover:scale-100 bg-green-700 text-white duration-200 ease-in-out max-w-screen-desktop:scale-100 scale-75"
                            >
                                <span>
                                    Reset <i className="fa-solid fa-trash" />
                                </span>
                            </Button>

                            <Button
                                variant="text"
                                color="red"
                                onClick={() => handleOpenSendMessage(null)}
                                className="border-[1px] p-2 max-w-screen-desktop:hover:scale-110 hover:scale-100 bg-red-700 text-white duration-200 ease-in-out max-w-screen-desktop:scale-100 scale-75"
                            >
                                <span>
                                    Salir{" "}
                                    <i className="fa-solid fa-door-open"></i>
                                </span>
                            </Button>
                        </div>
                    </div>

                    <article className="w-full text-center h-full p-4 flex flex-col items-center justify-start gap-2 ">
                        {conversacion
                            ? conversacion.map((msg, id) => {
                                  return (
                                      <span
                                          className="w-full  odd:bg-slate-800 even:bg-slate-700 "
                                          key={id}
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
