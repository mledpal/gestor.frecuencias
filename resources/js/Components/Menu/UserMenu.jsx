import { AppContext } from "../AppProvider";
import { useContext } from "react";

export const UserMenu = ({ setVista, setVisible }) => {

    const { busqueda, setBusqueda, isSmallScreen } = useContext(AppContext);

    return (
        <>
            <li
                className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                onClick={() => {
                    setVisible(null);
                    setVista(isSmallScreen ? "movil" : "main");
                }}
            >
                <i className="fa-solid fa-walkie-talkie"></i>
                Contactos
            </li>
            {isSmallScreen && (
                <li
                    className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                    onClick={() => {
                        setVisible(null);
                        setVista("crear_contacto");
                    }}
                >
                    <i className="fa-solid fa-plus"></i>
                    Crear Contacto
                </li>
            )}

            {isSmallScreen && (
                <>
                    <li
                        className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                        onClick={() => {
                            setVista("buscar_contacto");
                            setVisible(null);
                        }}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                        Buscar Contacto
                    </li>
                    {busqueda ? (
                        <li
                            className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                            onClick={() => setBusqueda(null)}
                        >
                            <i className="fa-solid fa-broom cursor-pointer hover:scale-150 duration-150 select-none"></i>
                            Borrar Búsqueda
                        </li>
                    ) : (
                        ""
                    )}
                    <li
                        className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                        onClick={() => {
                            setVista("filtros");
                            setVisible(null);
                        }}
                    >
                        <i className="fa-solid fa-filter"></i>
                        Filtros
                    </li>
                    <hr className="my-2" />
                    <li
                        className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm "
                        onClick={() => {
                            setVisible(null);
                            setVista("mensajes");
                        }}
                    >
                        <i className="fa-sharp fa-solid fa-envelope"></i>
                        Mensajes
                    </li>
                    <li
                        className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm "
                        onClick={() => {
                            setVisible(null);
                            setVista("buscar_usuario");
                        }}
                    >
                        <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                        Buscar Usuario
                    </li>
                </>
            )}
        </>
    );
};
