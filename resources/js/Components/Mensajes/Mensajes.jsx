import { useEffect, useState } from "react";
import { UserImage } from "../Images/UserImage";
import { getConversaciones } from "@/Helpers/getConversaciones";
import { borrarConversacion } from "./helpers/borrarConversacion";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const Mensajes = ({
    handleOpenUserSearcher,
    handleOpenSendMessage,
    setUserID,
    userDB,
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
                            onClick={() => handleOpenUserSearcher("xxl")}
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

                <main
                    name="lista_mensajes"
                    className="w-full h-full p-4 overflow-y-auto select-none"
                >
                    {mensajes
                        ? mensajes.map((c, index) => {
                              return (
                                  <div
                                      key={index}
                                      className="p-4 my-2 w-full mx-auto flex odd:bg-slate-800 even:bg-slate-700 shadow-[-2px_2px_5px_rgba(0,0,0,.5)] items-center justify-between rounded-lg"
                                  >
                                      <div
                                          onClick={(e) =>
                                              handleUserClicked(e, c.id)
                                          }
                                          className=" text-xs justify-center  font-light"
                                          link="#"
                                      >
                                          <UserImage userDB={c} link="" />
                                      </div>
                                      <span
                                          onClick={(e) =>
                                              handleDeleteConversation(e, c.id)
                                          }
                                      >
                                          <i className="fa-solid fa-trash-can text-red-500 cursor-pointer hover:scale-125 hover:shadow-[0_0_5px_rgba(0,0,0,.1)] ease-in-out duration-150 hover:drop-shadow-[0_0_5px_rgba(255,255,255,.4)]"></i>
                                      </span>
                                  </div>
                              );
                          })
                        : "No hay comentarios"}
                </main>
            </div>
        </>
    );
};
