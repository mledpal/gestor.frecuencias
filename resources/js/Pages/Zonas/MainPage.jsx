import React from "react";
import { Dialog } from "@material-tailwind/react";

import { useState } from "react";

import { CuadroFiltros } from "@/Components/Contactos/CuadroFiltros";
import { EditarContacto } from "@/Components/Contactos/Form/EditarContacto";
import { ListaContactos } from "@/Components/Contactos/ListaContactos";
import { NoContactos } from "@/Components/Contactos/NoContactos";
import { useFilters } from "@/hooks/useFilters";
import { NuevoContacto } from "@/Components/Contactos/Form/NuevoContacto";
import { useContactoCreate } from "@/hooks/useContactoCreate";

export const MainPage = ({ selects }) => {
    const [datos, setDatos] = useState(null);

    const {
        handleCheck,
        contactosFiltrados,
        filtros,
        listaFiltros,
        handleFilterVisible,
        visible,
        handlerCheckUncheck,
        eraseContact,
        updateContact,
    } = useFilters();

    const { datosNuevos, handleOpen, open } = useContactoCreate();

    const borrarContacto = (id) => {
        setDatos(null);
        eraseContact(id);
    };

    return (
        <>
            <div className="flex flex-row gap-1 h-full w-full items-center justify-between">
                <div
                    id="contactos"
                    className="h-full px-8 py-2 bg-slate-900 w-[350px] flex flex-col items-center justify-center grow overflow-y-auto overflow-x-hidden "
                >
                    <div
                        name="botones_contactos"
                        className="sticky top-0 mt-0 mb-8 px-1 h-[25px] w-full flex flex-row justify-around items-center select-none bg-slate-900 z-10 "
                    >
                        <i
                            onClick={() => handleOpen("lg")}
                            className="fa-solid fa-circle-plus cursor-pointer hover:scale-150 transition-transform ease-in-out"
                        ></i>
                        <i className="fa-solid fa-magnifying-glass cursor-pointer transition-transform ease-in-out hover:scale-150"></i>
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

                    <ListaContactos
                        contactos={contactosFiltrados}
                        setDatos={setDatos}
                    />
                </div>

                <div id="detalle" className="mx-4 h-full w-3/5 overflow-y-auto">
                    {datos ? (
                        <EditarContacto
                            datos={datos}
                            selects={selects}
                            isFocused={true}
                            contactos={contactos}
                            setDatos={setDatos}
                            borrarContacto={borrarContacto}
                            updateContact={updateContact}
                        />
                    ) : (
                        <NoContactos />
                    )}
                </div>

                <div id="mensajes" className="h-full w-1/5"></div>
            </div>

            <Dialog
                id="nuevocontacto"
                name="nuevocontacto"
                size="lg"
                open={open}
                handler={handleOpen}
                className="bg-transparent overflow-y-scroll "
            >
                <NuevoContacto
                    datos={datosNuevos}
                    handleOpen={handleOpen}
                    selects={selects}
                    isFocused={true}
                    updateContact={updateContact}
                />
            </Dialog>
        </>
    );
};
