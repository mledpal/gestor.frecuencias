import { ListaContactos } from "@/Components/Contactos/ListaContactos";

export const MainPage = ({ contactos }) => {
    return (
        <div className="grid grid-cols-3 gap-2 h-max grow">
            <div
                id="contactos"
                className="bg-slate-900 w-[80%]"
            >
                <ListaContactos contactos={contactos} />
            </div>
            <div id="mensajes" className=""></div>
            <div id="mensajes" className=""></div>
        </div>
    );
};
