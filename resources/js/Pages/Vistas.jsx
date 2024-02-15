import { useState } from "react";
import { Users } from "./Admin/Users/Users";
import { MainPage } from "./Vistas/MainPage";
import { MovilPage } from "./Vistas/MovilPage";
import { NuevoContacto } from "@/Components/Contactos/Form/NuevoContacto";
import { useContactoCreate } from "@/hooks/useContactoCreate";
import { useFilters } from "@/hooks/useFilters";
import { BuscarContacto } from "@/Components/Contactos/Form/BuscarContacto";
import { useMediaQuery } from "@react-hook/media-query";
import { Mensajes } from "@/Components/Mensajes/Mensajes";
import { useBuscarUsuario } from "@/hooks/useBuscarUsuario";
import { Conversacion } from "@/Components/Conversacion/Conversacion";
import { BuscarUsuarios } from "@/Components/Usuarios/Forms/BuscarUsuarios";

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
    const [id, setID] = useState(null);

    const {
        userID,
        setUserID,
        sizeUserSearchModal,
        sizeUserMsg,
        handleOpenUserSearcher,
        handleOpenSendMessage,
    } = useBuscarUsuario();

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

            {/* Vistas de administración de usuarios */}
            {vista === "admin_users" && (
                <Users isSmallScreen={isSmallScreen} userDB={userDB} />
            )}

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
                />
            )}

            {vista === "mensajes" && (
                <Mensajes
                    userDB={userDB}
                    handleOpenSendMessage={handleOpenSendMessage}
                    setUserID={setUserID}
                    isSmallScreen={isSmallScreen}
                    setVista={setVista}
                    setID={setID}
                />
            )}

            {vista === "buscar_usuario" && (
                <BuscarUsuarios
                    handleOpenBuscador={handleOpenUserSearcher}
                    handleOpenSendMessage={handleOpenSendMessage}
                    setUserID={setID}
                    setVista={setVista}
                    isSmallScreen={isSmallScreen}
                />
            )}

            {vista === "conversacion" && id && (
                <Conversacion
                    userID={id}
                    userDB={userDB}
                    setVista={setVista}
                    isSmallScreen={isSmallScreen}
                />
            )}
        </div>
    );
};
