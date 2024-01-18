import { EditarContacto } from "@/Components/Contactos/Form/EditarContacto";
import { ListaContactos } from "@/Components/Contactos/ListaContactos";
import { NoContactos } from "@/Components/Contactos/NoContactos";
import { useState } from "react";

export const MainPage = ({
    contactos,
    tipos_contacto,
    bandas,
    modos,
    codificaciones,
    dcs,
    ctcss,
    direcciones,
}) => {
    const [datos, setDatos] = useState(null);

    return (
        <div className="flex flex-row gap-1 h-full w-full items-center justify-between">
            <div
                id="contactos"
                className="h-full p-4 bg-slate-900 w-max flex flex-col items-center justify-center grow-0 overflow-y-auto overflow-x-hidden"
            >
                <div
                    name="botones_contactos"
                    className="sticky top-0 mt-0 mb-8 p-1 py-2 h-[100px] w-full flex flex-row justify-around items-center gap-5 select-none bg-slate-900 z-10 "
                >
                    <i className="fa-solid fa-circle-plus cursor-pointer hover:scale-150 transition-transform ease-in-out"></i>
                    <i className="fa-solid fa-magnifying-glass cursor-pointer transition-transform ease-in-out hover:scale-150"></i>
                    <i className="fa-solid fa-filter cursor-pointer transition-transform ease-in-out hover:scale-150"></i>
                </div>

                <ListaContactos
                    contactos={contactos}
                    tipos_contacto={tipos_contacto}
                    bandas={bandas}
                    modos={modos}
                    codificaciones={codificaciones}
                    dcs={dcs}
                    ctcss={ctcss}
                    direcciones={direcciones}
                    setDatos={setDatos}
                />
            </div>

            <div id="detalle" className="mx-4 h-full w-max overflow-y-auto">
                {datos ? (
                    <EditarContacto
                        datos={datos}
                        tipos_contacto={tipos_contacto}
                        bandas={bandas}
                        modos={modos}
                        codificaciones={codificaciones}
                        dcs={dcs}
                        ctcss={ctcss}
                        direcciones={direcciones}
                        isFocused={true}
                    />
                ) : (
                    <NoContactos />
                )}
            </div>

            <div id="mensajes" className="h-full w-2/5"></div >
        </div>
    );
};
