import React, { useEffect } from "react";
import { Dialog } from "@material-tailwind/react";

import { useState } from "react";

import { CuadroFiltros } from "@/Components/Contactos/CuadroFiltros";
import { EditarContacto } from "@/Components/Contactos/Form/EditarContacto";
import { ListaContactos } from "@/Components/Contactos/ListaContactos";
import { NoContactos } from "@/Components/Contactos/NoContactos";
import { useFilters } from "@/hooks/useFilters";
import { NuevoContacto } from "@/Components/Contactos/Form/NuevoContacto";
import { useContactoCreate } from "@/hooks/useContactoCreate";
import { Comentarios } from "@/Components/Comentarios/Comentarios";
import { BuscarContacto } from "@/Components/Contactos/Form/BuscarContacto";
import { Mensajes } from "@/Components/Mensajes/Mensajes";
import { useBuscarUsuario } from "@/hooks/useBuscarUsuario";
import { Conversacion } from "@/Components/Conversacion/Conversacion";
import { BuscarUsuarios } from "@/Components/Usuarios/Forms/BuscarUsuarios";
import { RotatingLines } from "react-loader-spinner";

export const MainPage = ({ selects, isAdmin, busqueda, userDB }) => {
    const [datos, setDatos] = useState(null);

    const {
        contactosFiltrados,
        filtros,
        listaFiltros,
        visible,
        handleCheck,
        handleFilterVisible,
        handlerCheckUncheck,
        eraseContact,
        updateContact,
        busquedaReset,
        isLoading,
    } = useFilters(busqueda);

    const { datosNuevos, handleOpen, open } = useContactoCreate();

    const [size, setSize] = useState(null);
    const handleOpenBuscador = (value) => setSize(value);

    const borrarContacto = (id) => {
        setDatos(null);
        eraseContact(id);
    };

    const {
        userID,
        setUserID,
        sizeUserSearchModal,
        sizeUserMsg,
        handleOpenUserSearcher,
        handleOpenSendMessage,
    } = useBuscarUsuario();

    return (
        <>
            <div className="flex flex-row h-full w-full items-center justify-start">
                <div
                    id="contactos"
                    className="h-full py-2 bg-slate-900 w-2/12 flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden grow-0 "
                >
                    <div
                        name="botones_contactos"
                        className="sticky top-0 mt-0 mb-10 p-1 h-[80px] w-full flex flex-row justify-around items-center select-none bg-transparent z-10 backdrop-blur-lg"
                    >
                        <i
                            onClick={() => handleOpen("lg")}
                            className="fa-solid fa-circle-plus cursor-pointer hover:scale-150 transition-transform ease-in-out"
                        ></i>
                        <i
                            className={`fa-solid fa-magnifying-glass cursor-pointer transition-transform ease-in-out hover:scale-150 ${
                                busqueda ? "text-red-500" : ""
                            }`}
                            onClick={() => handleOpenBuscador("xxl")}
                        ></i>
                        {busqueda ? (
                            <i
                                className="fa-solid fa-broom cursor-pointer hover:scale-150 duration-150 select-none"
                                onClick={() => busquedaReset()}
                            ></i>
                        ) : (
                            ""
                        )}
                        <span>
                            <i
                                className={`fa-solid fa-filter cursor-pointer transition-transform ease-in-out hover:scale-150 $hover:text-red-500 ${
                                    visible ? "text-red-500 scale-150" : ""
                                } relative`}
                                onClick={handleFilterVisible}
                            ></i>
                            {visible ? (
                                <CuadroFiltros
                                    handleCheck={handleCheck}
                                    filtros={filtros}
                                    listaFiltros={listaFiltros}
                                    handlerCheckUncheck={handlerCheckUncheck}
                                />
                            ) : (
                                ""
                            )}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="h-full w-full flex flex-col items-center p-1">
                            <RotatingLines
                                visible={true}
                                height="96"
                                width="96"
                                color="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                ariaLabel="rotating-lines-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    ) : (
                        <ListaContactos
                            contactos={contactosFiltrados}
                            setDatos={setDatos}
                        />
                    )}
                </div>

                <div
                    id="detalle"
                    className="mx-4 h-full overflow-y-auto w-7/12"
                >
                    {datos ? (
                        <EditarContacto
                            datos={datos}
                            selects={selects}
                            isFocused={true}
                            setDatos={setDatos}
                            borrarContacto={borrarContacto}
                            updateContact={updateContact}
                            userDB={userDB}
                        />
                    ) : (
                        <NoContactos
                            handleOpen={handleOpen}
                            handleOpenBuscador={handleOpenBuscador}
                            handleOpenUserSearcher={handleOpenUserSearcher}
                        />
                    )}
                </div>
                <div
                    id="mensajes"
                    className="h-full grow w-3/12 flex flex-col items-center justify-start mx-2"
                >
                    {datos ? (
                        <Comentarios datos={datos} isAdmin={isAdmin} />
                    ) : (
                        <Mensajes
                            userDB={userDB}
                            handleOpenUserSearcher={handleOpenUserSearcher}
                            handleOpenSendMessage={handleOpenSendMessage}
                            setUserID={setUserID}
                        />
                    )}
                </div>
            </div>

            <Dialog
                id="nuevocontacto"
                name="nuevocontacto"
                size="xxl"
                open={open}
                handler={handleOpen}
                className="w-screen min-h-screen backdrop-blur-sm bg-transparent shadow-transparent flex flex-col m-auto  overflow-y-auto"
            >
                <NuevoContacto
                    datos={datosNuevos}
                    selects={selects}
                    handleOpen={handleOpen}
                    updateContact={updateContact}
                    // getContacts={this.getContacts}
                />
            </Dialog>

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
                className="w-screen min-h-screen backdrop-blur-sm bg-transparent shadow-transparent flex flex-col m-auto  overflow-y-auto"
            >
                <BuscarContacto
                    isAdmin={isAdmin}
                    selects={selects}
                    handleOpenBuscador={handleOpenBuscador}
                />
            </Dialog>
            <Dialog
                open={
                    sizeUserSearchModal === "xs" ||
                    sizeUserSearchModal === "sm" ||
                    sizeUserSearchModal === "md" ||
                    sizeUserSearchModal === "lg" ||
                    sizeUserSearchModal === "xl" ||
                    sizeUserSearchModal === "xxl"
                }
                onClose={() => handleOpenUserSearcher(null)}
                size={sizeUserSearchModal || "md"}
                handler={handleOpenUserSearcher}
                className="w-screen min-h-screen backdrop-blur-sm bg-transparent shadow-transparent flex flex-col m-auto  overflow-y-auto"
            >
                <BuscarUsuarios
                    handleOpenBuscador={handleOpenUserSearcher}
                    handleOpenSendMessage={handleOpenSendMessage}
                    setUserID={setUserID}
                />
            </Dialog>
            <Dialog
                open={
                    sizeUserMsg === "xs" ||
                    sizeUserMsg === "sm" ||
                    sizeUserMsg === "md" ||
                    sizeUserMsg === "lg" ||
                    sizeUserMsg === "xl" ||
                    sizeUserMsg === "xxl"
                }
                onClose={() => handleOpenSendMessage(null)}
                size={sizeUserMsg || "md"}
                handler={handleOpenSendMessage}
                className="w-screen min-h-screen backdrop-blur-sm bg-transparent shadow-transparent flex flex-col m-auto  overflow-y-auto"
            >
                <Conversacion
                    handleOpenSendMessage={handleOpenSendMessage}
                    userID={userID}
                    userDB={userDB}
                />
            </Dialog>
        </>
    );
};
