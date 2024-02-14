import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { UserImage } from "@/Components/Images/UserImage";
import { BotonesFormulario } from "@/Components/BotonesFormulario/BotonesFormulario";
import Swal from "sweetalert2";

export const BuscarUsuarios = ({
    handleOpenBuscador,
    handleOpenSendMessage,
    setUserID,
    isSmallScreen,
    setVista,
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

    return (
        <div
            id="buscarUsuario"
            className={`shadow-[0px_0px_15px_rgba(255,255,255,.5)] flex flex-col items-center justify-between rounded-xl m-auto ${
                respuesta ? "overflow-y-auto" : ""
            }`}
        >
            <header className="h-15 w-full flex items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)]">
                Buscador de Usuarios
            </header>

            <form
                onSubmit={submit}
                className="h-full w-full flex flex-col justify-between font-sans"
            >
                <main className="flex flex-col grow bg-gradient-to-br from-slate-800  to-gray-800 shadow-[inset_2px_0px_5px_rgba(255,255,255,.5),inset_-2px_0px_5px_rgba(0,0,0,.5)] pb-5">
                    <div className="flex flex-row items-center justify-between px-4 gap-4 mt-4">
                        <div className="w-full">
                            <InputLabel
                                htmlFor="usuario_bus"
                                value="Usuario"
                                className={classesLabel}
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
                                onSubmit={submit}
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
                                className={classesLabel}
                            />
                            <TextInput
                                name="indicativo_bus"
                                value={data.indicativo}
                                isFocused={true}
                                className="mt-1 block w-full text-center"
                                onChange={(e) =>
                                    setData("indicativo", e.target.value)
                                }
                                onSubmit={submit}
                                autoComplete="off"
                                placeholder="indicativo"
                            />
                            <InputError
                                message={errors.indicativo}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between px-4 gap-4 mt-4">
                        <div className="w-full flex flex-col items-center">
                            <InputLabel
                                htmlFor="localidad"
                                value="Localidad"
                                className={classesLabel}
                            />
                            <TextInput
                                id="localidad"
                                name="localidad"
                                value={data.localidad}
                                className="mt-1 block w-full text-center"
                                onChange={(e) =>
                                    setData("localidad", e.target.value)
                                }
                                onSubmit={submit}
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
                                className={classesLabel}
                            />
                            <TextInput
                                id="provincia"
                                name="provincia"
                                value={data.provincia}
                                className="mt-1 block w-full text-center"
                                onChange={(e) =>
                                    setData("provincia", e.target.value)
                                }
                                onSubmit={submit}
                                autoComplete="off"
                                placeholder="Provincia"
                            />
                            <InputError
                                message={errors.provincia}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <article className="w-full text-center h-full p-4 flex flex-col items-center justify-start gap-2">
                        {respuesta ? (
                            respuesta.map((user, id) => (
                                <span
                                    key={id}
                                    onClick={(e) => {
                                        if (!isSmallScreen) {
                                            handleUserClicked(e, user.id);
                                        } else {
                                            setUserID(user.id);
                                            setVista("conversacion");
                                        }
                                    }}
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
                        actionReset={() => {
                            reset();
                            setRespuesta(null);
                        }}
                        actionExit={() =>
                            isSmallScreen
                                ? setVista("movil")
                                : handleOpenBuscador(null)
                        }
                    />
                </footer>
            </form>
        </div>
    );
};
