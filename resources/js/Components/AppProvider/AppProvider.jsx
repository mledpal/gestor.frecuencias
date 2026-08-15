import { AppContext } from "./AppContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePantallaPequena } from "@/hooks/usePantallaPequena";
import { getContactos } from "@/Helpers/getContactos";

export const AppProvider = ({ children }) => {
    const isSmallScreen = usePantallaPequena();
    const [modoOscuro, setModoOscuro] = useState(false);
    const [contactos, setContactos] = useState(null);
    const [busqueda, setBusqueda] = useState(null);
    const [selects, setSelects] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [userDB, setUserDB] = useState(null);
    const [vista, setVista] = useState("main");
    const [title, setTitle] = useState(null);
    const [contactoActivo, setContactoActivo] = useState(null);

    // LEDs de la cabecera (TX al enviar, MSG al recibir): estado transitorio
    // que se apaga solo tras un pulso breve.
    const [ledsActivos, setLedsActivos] = useState({ tx: false, msg: false });
    const timeoutsLed = useRef({});

    const pulsarLed = useCallback((led, duracionMs = 400) => {
        setLedsActivos((prev) => ({ ...prev, [led]: true }));
        clearTimeout(timeoutsLed.current[led]);
        timeoutsLed.current[led] = setTimeout(() => {
            setLedsActivos((prev) => ({ ...prev, [led]: false }));
        }, duracionMs);
    }, []);

    useEffect(
        () => () => Object.values(timeoutsLed.current).forEach(clearTimeout),
        []
    );

    useEffect(() => {
        userDB &&
            setIsAdmin(
                (userDB.roles ?? []).some((rol) => rol.nombre === "admin")
            );
    }, [userDB]);

    // Carga única de los contactos del usuario: useFilters() se instancia a
    // la vez en varios componentes (Vistas.jsx y la página activa), y cada
    // instancia disparaba su propia petición en el montaje.
    useEffect(() => {
        let activo = true;
        getContactos().then((datos) => {
            if (activo && datos) setContactos(datos);
        });
        return () => {
            activo = false;
        };
    }, []);

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
                contactoActivo,
                setContactoActivo,
                ledsActivos,
                pulsarLed,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
