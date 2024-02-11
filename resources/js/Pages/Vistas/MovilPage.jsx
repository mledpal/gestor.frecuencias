import { EditarContacto } from "@/Components/Contactos/Form/EditarContacto";
import { ListaContactos } from "@/Components/Contactos/ListaContactos";
import { useFilters } from "@/hooks/useFilters";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

export const MovilPage = ({ selects, isAdmin, busqueda, userDB }) => {
    const [datos, setDatos] = useState(null);

    const { contactosFiltrados, eraseContact, updateContact } =
        useFilters(busqueda);

    const borrarContacto = (id) => {
        setDatos(null);
        eraseContact(id);
    };

    return (
        <>
            <div className="w-full h-full overflow-y-auto overflow-x-hidden">
                {datos ? (
                    <EditarContacto
                        datos={datos}
                        selects={selects}
                        setDatos={setDatos}
                        borrarContacto={borrarContacto}
                        updateContact={updateContact}
                        userDB={userDB}
                    />
                ) : (
                    <ListaContactos
                        contactos={contactosFiltrados}
                        setDatos={setDatos}
                    />
                )}
            </div>
        </>
    );
};
