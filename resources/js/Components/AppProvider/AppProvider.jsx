import { AppContext } from "./AppContext";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@react-hook/media-query";

export const AppProvider = ({ children }) => {
    const isSmallScreen = useMediaQuery("(max-width: 900px)");
    const [modoOscuro, setModoOscuro] = useState(false);
    const [contactos, setContactos] = useState(null);
    const [busqueda, setBusqueda] = useState(null);
    const [selects, setSelects] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [userDB, setUserDB] = useState(null);
    const [vista, setVista] = useState("main");
    const [title, setTitle] = useState(null);

    useEffect(() => {
        userDB &&
            setIsAdmin(userDB.roles.some((rol) => rol.nombre === "admin"));
    }, [userDB]);

    return (
        <AppContext.Provider
            value={{
                vista,
                setVista,
                modoOscuro,
                setModoOscuro,
                isSmallScreen,
                contactos,
                setContactos,
                busqueda,
                setBusqueda,
                selects,
                setSelects,
                userDB,
                setUserDB,
                title,
                setTitle,
                isAdmin,
                setIsAdmin,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
