import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { searchUsers } from "./helpers/searchUsers";
import { UserImage } from "@/Components/Images/UserImage";

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
                                placeholder="usuario"
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
                    <Button
                        variant="gradient"
                        color="blue"
                        onClick={submit}
                        className="border-[1px] px-5 py-2 hover:scale-110 bg-blue-700 text-white duration-200 ease-in-out"
                    >
                        <span>
                            Enviar <i className="fa-solid fa-paper-plane"></i>
                        </span>
                    </Button>
                    <Button
                        variant="text"
                        color="light-green"
                        onClick={() => {
                            reset();
                            setRespuesta(null);
                        }}
                        className="border-[1px] px-5 py-2 hover:scale-110 bg-green-700 text-white duration-200 ease-in-out"
                    >
                        <span>
                            Reset <i className="fa-solid fa-trash" />
                        </span>
                    </Button>

                    <Button
                        variant="text"
                        color="red"
                        onClick={() => handleOpenBuscador(null)}
                        className="border-[1px] px-5 py-2 hover:scale-110 bg-red-700 text-white duration-200 ease-in-out"
                    >
                        <span>
                            Salir <i className="fa-solid fa-door-open"></i>
                        </span>
                    </Button>
                </footer>
            </form>
        </div>
    );
};
