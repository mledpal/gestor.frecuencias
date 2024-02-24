import { useEffect, useState } from "react";
import { getConversaciones } from "@/Helpers/getConversaciones";
import { borrarConversacion } from "./helpers/borrarConversacion";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DatosUsuario } from "../Usuarios/Forms/DatosUsuario";

export const Mensajes = ({
    handleOpenUserSearcher,
    handleOpenSendMessage,
    setUserID,
    userDB,
    setVista,
    isSmallScreen,
    setID,
}) => {
    const [mensajes, setMensajes] = useState([]);
    const clasesBotonesFormulario =
        "cursor-pointer hover:scale-150 duration-150 hover:ease-in ease-linear select-none";

    async function getData() {
        let texto = await getConversaciones();
        setMensajes(texto);
    }

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
                    getData();
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
        if (isSmallScreen) {
            setID(id);
            setVista("conversacion");
        } else {
            setUserID(id);
            handleOpenSendMessage("xxl");
        }
    };

    console.log(mensajes);

    return (
        <>
            <div className="flex flex-col items-center justify-between  w-full h-full">
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
                            onClick={() =>
                                handleOpenUserSearcher
                                    ? handleOpenUserSearcher("xxl")
                                    : setVista("buscar_usuario")
                            }
                        ></i>
                        {/* <i
                        className={`fa-solid fa-person-walking-arrow-right text-white `}
                    ></i> */}
                    </div>
                    <h2 className="w-full text-center font-bold max-w-screen-desktop:text-xl text-lg">
                        Conversaciones
                    </h2>
                    <div className="w-1/5"></div>
                </header>

                <main
                    name="lista_mensajes"
                    className="w-full h-full p-0 overflow-y-auto select-none"
                >
                    {mensajes
                        ? mensajes.map((c, index) => {
                              return (
                                  <DatosUsuario
                                      key={index}
                                      c={c}
                                      handleUserClicked={handleUserClicked}
                                      handleDeleteConversation={
                                          handleDeleteConversation
                                      }
                                  />
                              );
                          })
                        : "No hay mensajes"}
                </main>
            </div>
        </>
    );
};
