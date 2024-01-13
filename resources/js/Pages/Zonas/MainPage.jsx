import { ListaContactos } from "@/Components/Contactos/ListaContactos";
import { useEffect } from "react";

export const MainPage = ({ contactos }) => {

    return (
        <div className="grid grid-cols-3 gap-2 h-full items-center">
            <div
                id="contactos"
                className="h-full p-4 bg-slate-900 w-4/5 flex items-center justify-center grow-0 overflow-y-auto overflow-x-hidden"
            >
                <ListaContactos contactos={contactos} />
            </div>
            <div id="mensajes" className=""></div>
            <div id="mensajes" className=""></div>
        </div>
    );
};
