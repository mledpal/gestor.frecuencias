import { EditarContacto } from "@/Components/Contactos/Form/EditarContacto";
import { ListaContactos } from "@/Components/Contactos/ListaContactos";
import { useFilters } from "@/hooks/useFilters";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";

export const MovilPage = ({ selects, isAdmin, busqueda, userDB, setVista }) => {
    const [datos, setDatos] = useState(null);

    const { contactosFiltrados, eraseContact, updateContact, isLoading } =
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
                ) : isLoading ? (
                    <div className="h-full w-full grid place-items-center p-1">
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
                        setVista={setVista}
                    />
                )}
            </div>
        </>
    );
};
