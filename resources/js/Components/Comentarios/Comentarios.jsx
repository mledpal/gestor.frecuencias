import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import InputError from "../InputError";
import TextInput from "../TextInput";

import { getComentarios } from "./Helpers/getComentarios";
import { Comentario } from "./Comentario";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// import Echo from "laravel-echo";
import Pusher from "pusher-js";

export const Comentarios = ({ datos, isAdmin }) => {
    const MySwal = withReactContent(Swal);
    const [comentarios, setComentarios] = useState([]);

    // useEffect(() => {
    //     Pusher.logToConsole = true;
    //     const pusher = new Pusher("5285b606cdf2c249808a", {
    //         cluster: "eu",
    //     });
    //     const channel = pusher.subscribe("canal-comentarios");
    //     channel.bind("NuevoComentario", function (data) {
    //         updateComentarios();
    //     });
    //     return () => {
    //         channel.unbind();
    //     };
    // }, [comentarios]);

    const { data, setData, post, processing, errors, reset } = useForm({
        localizacion_id: datos?.localizacion_id,
        frecuencia_id: datos?.frecuencia_id,
        comentario: "",
    });

    useEffect(() => {
        setData({
            localizacion_id: datos?.localizacion_id,
            frecuencia_id: datos?.frecuencia_id,
            comentario: "",
        });
    }, [datos]);

    const clasesBotonesFormulario =
        "cursor-pointer hover:scale-150 duration-150 hover:ease-in ease-linear select-none";

    useEffect(() => {
        Pusher.logToConsole = true;
        const pusher = new Pusher("5285b606cdf2c249808a", {
            cluster: "eu",
        });

        const channel = pusher.subscribe("canal-comentarios");

        channel.bind("App\\Events\\NuevoComentario", (data) => {
            setComments([...comments, data]);
        });

        return () => {
            channel.unbind();
            pusher.unsubscribe("canal-comentarios");
        };
    }, [comentarios]);

    const updateComentarios = () => {
        const fetchData = async () => {
            try {
                // Realizar la solicitud para obtener los comentarios
                const respuesta = await getComentarios({
                    frecuencia: datos.frecuencia_id,
                    localizacion: datos.localizacion_id,
                });

                // Verificar si se recibieron datos
                if (respuesta) {
                    setComentarios(respuesta);
                } else {
                    console.log("No se recibieron comentarios.");
                }
            } catch (error) {
                console.error("Error al obtener comentarios:", error);
            }
        };

        fetchData();
    };

    useEffect(() => {
        updateComentarios();
    }, [datos]);

    const submit = (e) => {
        e.preventDefault();

        post(route("comentario_crear"), {
            onSuccess: () => {
                reset("comentario");
                updateComentarios();
            },
            onError: (errors) => {
                Swal.fire({
                    title: "No actualizado",
                    text: "Hubo un error",
                    icon: "error",
                });
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-between gap-2 w-full h-full">
            <form
                name="comentarios"
                method="POST"
                onSubmit={submit}
                encType="multipart/form-data"
                className="sticky top-0  z-2 w-full flex flex-col items-center justify-center mt-0 gap-2"
            >
                <input
                    type="hidden"
                    name="localizacion_id"
                    value={datos.localizacion_id ?? ""}
                ></input>
                <input
                    type="hidden"
                    name="frecuencia_id"
                    value={datos.frecuencia_id ?? ""}
                ></input>

                <header
                    name="comentarios"
                    className="w-full flex flex-row items-center justify-between p-4 h-[75px] bg-slate-900"
                >
                    <div
                        name="botones_comentarios"
                        className="w-1/5 flex flex-row items-center justify-around"
                    >
                        <i
                            onClick={submit}
                            className={`fa-solid fa-paper-plane text-white ${clasesBotonesFormulario} `}
                        ></i>

                        <i
                            className={`fa-solid fa-trash text-red-500 ${clasesBotonesFormulario}`}
                            onClick={() => reset("comentario")}
                        ></i>
                        {/* <i
                        className={`fa-solid fa-person-walking-arrow-right text-white `}
                    ></i> */}
                    </div>
                    <div className="w-3/5 flex flex-col items-center justify-center text-center">
                        <h2 className="font-bold max-w-screen-desktop:text-xl text-lg">
                            Comentarios
                        </h2>
                    </div>
                    <div name="numero_comentarios" className="w-1/5"></div>
                </header>

                <div className="w-full rounded-xl">
                    <TextInput
                        id="comentario"
                        name="comentario"
                        value={data.comentario ?? ""}
                        className="p-2 block w-full text-center text-sm text-white"
                        onChange={(e) => setData("comentario", e.target.value)}
                        placeholder="Escriba un comentario"
                        required
                    />
                    <InputError message={errors.comentario} className="mt-2" />
                </div>
            </form>

            <div
                name="lista_comentarios"
                className="w-full h-full p-4 overflow-y-auto select-none"
            >
                {comentarios
                    ? comentarios.map((c) => {
                          return (
                              <div
                                  className="text-xs font-light odd:bg-slate-800 even:bg-slate-700"
                                  key={c.id}
                              >
                                  <Comentario
                                      c={c}
                                      isAdmin={isAdmin}
                                      updateComentarios={updateComentarios}
                                  />
                              </div>
                          );
                      })
                    : "No hay comentarios"}
            </div>
        </div>
    );
};
