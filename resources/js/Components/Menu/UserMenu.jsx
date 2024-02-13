import { useMediaQuery } from "@react-hook/media-query";

export const UserMenu = ({ setVista }) => {
    const isSmallScreen = useMediaQuery("(max-width: 900px)");

    return (
        <>
            <li
                className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                onClick={() => setVista(isSmallScreen ? "movil" : "main")}
            >
                <i className="fa-solid fa-walkie-talkie"></i>
                Contactos
            </li>
            {isSmallScreen && (
                <li
                    className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                    onClick={() => setVista("crear_contacto")}
                >
                    <i className="fa-solid fa-plus"></i>
                    Crear Contacto
                </li>
            )}

            {isSmallScreen && (
                <>
                    <li
                        className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                        onClick={() => setVista("buscar_contacto")}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                        Buscar Contacto
                    </li>
                    <hr className="my-2" />
                    <li
                        className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm "
                        onClick={() => setVista("mensajes")}
                    >
                        <i className="fa-sharp fa-solid fa-envelope"></i>
                        Mensajes
                    </li>
                    <li
                        className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm "
                        onClick={() => setVista("buscar_usuario")}
                    >
                        <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                        Buscar Usuario
                    </li>
                </>
            )}
        </>
    );
};
