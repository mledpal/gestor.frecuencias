import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";

import { useEffect, useState } from "react";
import { searchUsers } from "./helpers/searchUsers";
import { UserImage } from "@/Components/Images/UserImage";
import { BotonesFormulario } from "@/Components/BotonesFormulario/BotonesFormulario";

export const BuscarUsuarios = ({
    handleOpenBuscador,
    handleOpenSendMessage,
    setUserID,
}) => {
    const [respuesta, setRespuesta] = useState(null);
    const clasesLabel = "text-center mb-2 text-black select-none";

    useEffect(() => {
        setTimeout(() => {
            document.getElementById("buscarUsuario").scrollTo(0, 0);
        }, 100);
        setRespuesta(null);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        usuario: "",
        indicativo: "",
        localidad: "",
        provincia: "",
    });

    const handleUserClicked = (e, id) => {
        e.preventDefault();
        handleOpenBuscador(null);
        setUserID(id);
        handleOpenSendMessage("xxl");
    };

    async function submit(e) {
        e.preventDefault();
        let response = await searchUsers(data);
        setRespuesta(response);
    }

    return (
        <div
            id="buscarUsuario"
            className={`shadow-[0px_0px_15px_rgba(255,255,255,.5)] flex flex-col items-center justify-between  rounded-xl m-auto ${
                respuesta ? "overflow-y-auto" : ""
            }`}
        >
            <header className="h-15 w-full flex items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)]">
                Buscador de Usuarios
            </header>

            <form
                method="post"
                onSubmit={submit}
                className="h-full w-full flex flex-col justify-between font-sans"
            >
                <main className="flex flex-col grow bg-gradient-to-br from-slate-800  to-gray-800 shadow-[inset_2px_0px_5px_rgba(255,255,255,.5),inset_-2px_0px_5px_rgba(0,0,0,.5)] pb-5">
                    <div className="flex flex-row items-center justify-between px-4 gap-4 mt-4">
                        <div className="w-full">
                            <InputLabel
                                htmlFor="usuario_bus"
                                value="Usuario"
                                className={clasesLabel}
                            />
                            <TextInput
                                name="usuario_bus"
                                value={data.usuario}
                                isFocused={true}
                                className="mt-1 block w-full text-center"
                                onChange={(e) =>
                                    setData("usuario", e.target.value)
                                }
                                autoComplete="off"
                                placeholder="usuario"
                            />
                            <InputError
                                message={errors.usuario}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full">
                            <InputLabel
                                htmlFor="indicativo_bus"
                                value="Indicativo"
                                className={clasesLabel}
                            />
                            <TextInput
                                name="indicativo_bus"
                                value={data.indicativo}
                                isFocused={true}
                                className="mt-1 block w-full text-center"
                                onChange={(e) =>
                                    setData("indicativo", e.target.value)
                                }
                                autoComplete="off"
                                placeholder="indicativo"
                            />
                            <InputError
                                message={errors.usuario}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between px-4 gap-4 mt-4">
                        <div className="w-full flex flex-col items-center">
                            <InputLabel
                                htmlFor="localidad"
                                value="Localidad"
                                className={clasesLabel}
                            />
                            <TextInput
                                id="localidad"
                                name="localidad"
                                value={data.localidad}
                                className="mt-1 block w-full text-center"
                                onChange={(e) =>
                                    setData("localidad", e.target.value)
                                }
                                autoComplete="off"
                                placeholder="Localidad"
                            />

                            <InputError
                                message={errors.localidad}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full flex flex-col items-center">
                            <InputLabel
                                htmlFor="provincia"
                                value="Provincia"
                                className={clasesLabel}
                            />
                            <TextInput
                                id="provincia"
                                name="provincia"
                                value={data.provincia}
                                className="mt-1 block w-full text-center"
                                onChange={(e) =>
                                    setData("provincia", e.target.value)
                                }
                                autoComplete="off"
                                placeholder="Provincia"
                            />

                            <InputError
                                message={errors.localidad}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <article className="w-full text-center h-full p-4 flex flex-col items-center justify-start gap-2">
                        {respuesta ? (
                            respuesta.map((user, id) => (
                                <span
                                    key={id}
                                    onClick={(e) =>
                                        handleUserClicked(e, user.id)
                                    }
                                >
                                    <UserImage
                                        isAdmin={0}
                                        userDB={user}
                                        link="#"
                                    />
                                </span>
                            ))
                        ) : (
                            <h3>No hay datos</h3>
                        )}
                    </article>
                </main>

                <footer className="p-5 flex items-center justify-around h-15 bg-gradient-to-br from-blue-900 bg-slate-800 rounded-br-xl rounded-bl-xl font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)] ">
                    <BotonesFormulario
                        actionSubmit={submit}
                        actionReset={() => reset()}
                        actionExit={() => handleOpenBuscador(null)}
                    />
                </footer>
            </form>
        </div>
    );
};
