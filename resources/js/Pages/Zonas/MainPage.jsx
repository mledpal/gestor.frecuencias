import { ListaContactos } from "@/Components/Contactos/ListaContactos";

export const MainPage = ({
    contactos,
    tipos_contacto,
    bandas,
    modos,
    codificaciones,
    dcs,
    ctcss,
}) => {
    return (
        <div className="grid grid-cols-3 gap-2 h-full items-center">
            <div
                id="contactos"
                className="h-full p-4 bg-slate-900 w-[300px] flex flex-col items-center justify-center grow-0 overflow-y-auto overflow-x-hidden"
            >
                <div
                    name="botones_contactos"
                    className="sticky top-0 mt-0 mb-8 p-1 py-2 h-[100px] w-full flex flex-row justify-around items-center gap-5 select-none bg-slate-900 z-10"
                >
                    <i className="fa-solid fa-circle-plus cursor-pointer hover:scale-150 transition-transform ease-in-out"></i>
                    <i className="fa-solid fa-magnifying-glass cursor-pointer transition-transform ease-in-out hover:scale-150"></i>
                </div>
                <ListaContactos
                    contactos={contactos}
                    tipos_contacto={tipos_contacto}
                    bandas={bandas}
                    modos={modos}
                    codificaciones={codificaciones}
                    dcs={dcs}
                    ctcss={ctcss}
                />
            </div>
            <div id="mensajes" className=""></div>
            <div id="mensajes" className=""></div>
        </div>
    );
};
