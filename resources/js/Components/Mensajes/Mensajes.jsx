import { useForm } from "@inertiajs/react";
import InputError from "../InputError";
import TextInput from "../TextInput";
import { BuscarUsuario } from "../Usuarios/Forms/BuscarUsuarios";
import { useState } from "react";
import { Dialog } from "@material-tailwind/react";

export const Mensajes = (isAdmin) => {
    const mensajes = [];
    const clasesBotonesFormulario =
        "cursor-pointer hover:scale-150 duration-150 hover:ease-in ease-linear select-none";

    const { data, setData, post, processing, errors, reset } = useForm({
        usuario_bus: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        reset();
    };

    const [size, setSize] = useState(null);
    const handleOpenBuscador = (value) => setSize(value);

    return (
        <>
            <div className="flex flex-col items-center justify-between gap-2 w-full h-full">
                <header
                    name="mensajes"
                    className="w-full flex flex-row items-center justify-between p-6 h-[75px] bg-slate-900"
                >
                    <div
                        name="botones_comentarios"
                        className="w-1/5 flex flex-row items-center justify-around"
                    >
                        <i
                            // onClick={submit}
                            className={`fa-solid fa-magnifying-glass text-white ${clasesBotonesFormulario} `}
                            onClick={() => handleOpenBuscador('xxl')}
                        ></i>

                        <i
                            className={`fa-solid fa-trash text-red-500 ${clasesBotonesFormulario}`}
                            onClick={() => reset()}
                        ></i>
                        {/* <i
                        className={`fa-solid fa-person-walking-arrow-right text-white `}
                    ></i> */}
                    </div>
                    <h2 className="w-3/5 text-center font-bold max-w-screen-desktop:text-xl text-lg">
                        Mensajes
                    </h2>
                    <div className="w-1/5"></div>
                </header>

                <form className="w-full rounded-xl" onSubmit={handleSubmit}>
                    <TextInput
                        name="usuario_bus"
                        value={data.usuario_bus}
                        className="p-2 block w-full text-center text-sm text-white"
                        onChange={(e) => setData("usuario_bus", e.target.value)}
                        placeholder="Busque a un usuario"
                        required
                    />
                    <InputError message={errors.usuario_bus} className="mt-2" />
                </form>

                <main
                    name="lista_mensajes"
                    className="w-full h-full p-4 overflow-y-auto select-none"
                >
                    {mensajes
                        ? mensajes.map((c, index) => {
                              return (
                                  <div
                                      className="text-xs font-light odd:bg-slate-800 even:bg-slate-700"
                                      key={index}
                                  ></div>
                              );
                          })
                        : "No hay comentarios"}
                </main>
            </div>
            <Dialog
                open={
                    size === "xs" ||
                    size === "sm" ||
                    size === "md" ||
                    size === "lg" ||
                    size === "xl" ||
                    size === "xxl"
                }
                size={size || "md"}
                handler={handleOpenBuscador}
                className="w-screen min-h-screen bg-transparent shadow-transparent flex flex-col m-auto  overflow-y-auto"
            >
                <BuscarUsuario
                    handleOpenBuscador={handleOpenBuscador}
                />
            </Dialog>
        </>
    );
};
