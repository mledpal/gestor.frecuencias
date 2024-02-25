import { useContext, useState } from "react";
import { Users } from "./Admin/Users/Users";
import { MainPage } from "./Vistas/MainPage";
import { MovilPage } from "./Vistas/MovilPage";
import { NuevoContacto } from "@/Components/Contactos/Form/NuevoContacto";
import { useContactoCreate } from "@/hooks/useContactoCreate";
import { useFilters } from "@/hooks/useFilters";
import { BuscarContacto } from "@/Components/Contactos/Form/BuscarContacto";
import { Mensajes } from "@/Components/Mensajes/Mensajes";
import { useBuscarUsuario } from "@/hooks/useBuscarUsuario";
import { Conversacion } from "@/Components/Conversacion/Conversacion";
import { BuscarUsuarios } from "@/Components/Usuarios/Forms/BuscarUsuarios";
import { TiposContacto } from "./Admin/TiposContacto/TiposContacto";
import { TiposCodificacion } from "./Admin/TipoCodificacion/TiposCodificacion";
import { AppContext } from "@/Components/AppProvider";
import { FiltrosContacto } from "@/Components/Contactos/Form/FiltrosContacto";

export const Vistas = () => {
    const {
        vista,
        setVista,
        selects,
        isAdmin,
        busqueda,
        userDB,
        isSmallScreen,
    } = useContext(AppContext);

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

            {vista === "crear_contacto" && (
                <NuevoContacto
                    datos={datosNuevos}
                    selects={selects}
                    setVista={setVista}
                    updateContact={updateContact}
                />
            )}

            {vista === "filtros" && (
                <FiltrosContacto
                    busqueda={busqueda}
                    selects={selects}
                    setVista={setVista}
                    isSmallScreen={isSmallScreen}
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

            {/* Vistas de Administración */}
            {vista === "admin_users" && (
                <Users isSmallScreen={isSmallScreen} userDB={userDB} />
            )}

            {vista === "admin_tipo_contacto" && (
                <TiposContacto
                    setVista={setVista}
                    isSmallScreen={isSmallScreen}
                />
            )}

            {vista === "admin_tipo_codificacion" && (
                <TiposCodificacion
                    setVista={setVista}
                    isSmallScreen={isSmallScreen}
                />
            )}
        </div>
    );
};
