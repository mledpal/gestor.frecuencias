import InputError from "../InputError";
import TextInput from "../TextInput";

import { useForm } from "@inertiajs/react";
import { BuscarUsuarios } from "../Usuarios/Forms/BuscarUsuarios";
import { useEffect, useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { Conversacion } from "../Conversacion/Conversacion";
import { getConversaciones } from "@/Helpers/getConversaciones";
import { UserImage } from "../Images/UserImage";
import { borrarConversacion } from "./helpers/borrarConversacion";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const Mensajes = () => {
    const [mensajes, setMensajes] = useState([]);
    const clasesBotonesFormulario =
        "cursor-pointer hover:scale-150 duration-150 hover:ease-in ease-linear select-none";

    const { data, setData, post, processing, errors, reset } = useForm({
        usuario_bus: "",
    });

    async function getData() {
        let texto = await getConversaciones();
        setMensajes(texto);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        reset();
    };

    const [size, setSize] = useState(null);
    const handleOpenBuscador = (value) => setSize(value);

    const [sizeMsg, setSizeMsg] = useState(null);
    const [userID, setUserID] = useState(null);
    const handleOpenSendMessage = (value) => setSizeMsg(value);

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

    useEffect(() => {
        getData();
    }, []);

    const handleUserClicked = (e, id) => {
        e.preventDefault();
        setUserID(id);
        handleOpenSendMessage("xxl");
    };

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
                            onClick={() => handleOpenBuscador("xxl")}
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
                        Conversaciones
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
                                      key={index}
                                      className="p-4 w-full flex odd:bg-slate-800 even:bg-slate-700 items-center justify-between"
                                  >
                                      <div
                                          onClick={(e) =>
                                              handleUserClicked(e, c.id)
                                          }
                                          className=" text-xs  justify-center  font-light"
                                          link="#"
                                      >
                                          <UserImage userDB={c} link="" />
                                      </div>
                                      <span
                                          onClick={(e) =>
                                              handleDeleteConversation(e, c.id)
                                          }
                                      >
                                          <i className="fa-solid fa-trash-can text-red-500 cursor-pointer hover:scale-125 hover:shadow-[0_0_5px_rgba(0,0,0,.1)] ease-in-out duration-150"></i>
                                      </span>
                                  </div>
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
                <BuscarUsuarios
                    handleOpenBuscador={handleOpenBuscador}
                    handleOpenSendMessage={handleOpenSendMessage}
                    setUserID={setUserID}
                />
            </Dialog>

            <Dialog
                open={
                    sizeMsg === "xs" ||
                    sizeMsg === "sm" ||
                    sizeMsg === "md" ||
                    sizeMsg === "lg" ||
                    sizeMsg === "xl" ||
                    sizeMsg === "xxl"
                }
                size={sizeMsg || "md"}
                handler={handleOpenSendMessage}
                className="w-screen min-h-screen bg-transparent shadow-transparent flex flex-col m-auto  overflow-y-auto"
            >
                <Conversacion
                    handleOpenSendMessage={handleOpenSendMessage}
                    userID={userID}
                />
            </Dialog>
        </>
    );
};
