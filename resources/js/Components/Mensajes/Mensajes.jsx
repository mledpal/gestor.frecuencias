import { DatosUsuario } from "../Usuarios/Forms/DatosUsuario";
import { useMensajes } from "./hooks/useMensajes";

export const Mensajes = ({
    handleOpenUserSearcher,
    handleOpenSendMessage,
    setUserID,
    setVista,
    setID,
}) => {
    const { mensajes, handleUserClicked, handleDeleteConversation } =
        useMensajes({
            handleOpenSendMessage,
            setUserID,
            setID,
        });

    const clasesBotonesFormulario =
        "cursor-pointer hover:scale-150 duration-150 hover:ease-in ease-linear select-none";

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
                    className="w-full h-full mt-4 p-0 overflow-y-auto select-none"
                >
                    {mensajes
                        ? mensajes.map((c, index) => {
                              return (
                                  <div
                                      key={index}
                                      onClick={(e) =>
                                          handleUserClicked(e, c.id)
                                      }
                                  >
                                      <DatosUsuario
                                          c={c}
                                          handleDeleteConversation={
                                              handleDeleteConversation
                                          }
                                      />
                                  </div>
                              );
                          })
                        : "No hay mensajes"}
                </main>
            </div>
        </>
    );
};
