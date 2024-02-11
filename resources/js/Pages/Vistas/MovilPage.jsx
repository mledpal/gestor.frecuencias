import { ListaContactos } from "@/Components/Contactos/ListaContactos";
import { useFilters } from "@/hooks/useFilters";
import { useState } from "react";

export const MovilPage = ({ selects, isAdmin, busqueda, userDB }) => {
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
    } = useFilters(busqueda);
    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            <ListaContactos
                contactos={contactosFiltrados}
                setDatos={setDatos}
            />
        </div>
    );
};
