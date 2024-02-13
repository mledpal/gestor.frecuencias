import { useEffect, useState } from "react";
import { Users } from "./Admin/Users/Users";
import { MainPage } from "./Vistas/MainPage";
import { MovilPage } from "./Vistas/MovilPage";
import { NuevoContacto } from "@/Components/Contactos/Form/NuevoContacto";
import { useContactoCreate } from "@/hooks/useContactoCreate";
import { useFilters } from "@/hooks/useFilters";
import { BuscarContacto } from "@/Components/Contactos/Form/BuscarContacto";
import { useMediaQuery } from "@react-hook/media-query";

export const Vistas = ({
    vista,
    setVista,
    selects,
    isAdmin,
    busqueda,
    userDB,
}) => {
    const isSmallScreen = useMediaQuery("(max-width: 900px)");
    const { datosNuevos } = useContactoCreate();
    const { updateContact } = useFilters(busqueda);
    const [size, setSize] = useState(null);
    const handleOpenBuscador = (value) => setSize(value);

    return (
        <div className="w-full h-full">
            {vista === "main" && (
                <MainPage
                    selects={selects}
                    isAdmin={isAdmin}
                    busqueda={busqueda}
                    userDB={userDB}
                />
            )}
            {vista === "movil" && (
                <MovilPage
                    selects={selects}
                    isAdmin={isAdmin}
                    busqueda={busqueda}
                    userDB={userDB}
                    setVista={setVista}
                />
            )}
            {vista === "admin_users" && <Users />}

            {vista === "crear_contacto" && (
                <NuevoContacto
                    datos={datosNuevos}
                    selects={selects}
                    setVista={setVista}
                    updateContact={updateContact}
                />
            )}

            {vista === "buscar_contacto" && (
                <BuscarContacto
                    isAdmin={isAdmin}
                    selects={selects}
                    setVista={setVista}
                    isSmallScreen={isSmallScreen}
                    handleOpenBuscador={handleOpenBuscador}
                />
            )}
        </div>
    );
};
