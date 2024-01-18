import { Contacto } from "./Contacto";

import React from "react";

import { Dialog } from "@material-tailwind/react";

export const ListaContactos = ({
    contactos,
    tipos_contacto,
    bandas,
    modos,
    codificaciones,
    dcs,
    ctcss,
    direcciones,
    setDatos,
}) => {
    return (
        <>
            <div className="h-full flex flex-col p-4">
                {contactos.length > 0 ? (
                    contactos.map((c) => (
                        <Contacto
                            key={c.id}
                            datos={c}
                            tipos_contacto={tipos_contacto}
                            bandas={bandas}
                            modos={modos}
                            codificaciones={codificaciones}
                            dcs={dcs}
                            ctcss={ctcss}
                            direcciones={direcciones}
                            // handleOpen={handleOpen}
                            setDatos={setDatos}
                        />
                    ))
                ) : (
                    <h2>No hay resultados</h2>
                )}{" "}
            </div>

            {/* <Dialog
                size="xl"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none overflow-y-auto"
            >
                <EditarContacto
                    datos={datos}
                    handleOpen={handleOpen}
                    tipos_contacto={tipos_contacto}
                    bandas={bandas}
                    modos={modos}
                    codificaciones={codificaciones}
                    dcs={dcs}
                    ctcss={ctcss}
                    direcciones={direcciones}
                    isFocused={true}
                />
            </Dialog> */}
        </>
    );
};
