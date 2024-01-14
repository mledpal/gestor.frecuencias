import { ListaContactos } from "@/Components/Contactos/ListaContactos";


export const MainPage = ({
    contactos,
    tipos_contacto,
    bandas,
    modos,
    codificaciones,
    dcs,
    ctcss
}) => {
    return (
        <div className="grid grid-cols-3 gap-2 h-full items-center">
            <div
                id="contactos"
                className="h-full p-4 bg-slate-900 w-4/5 flex items-center justify-center grow-0 overflow-y-auto overflow-x-hidden"
            >
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
