export const UserMenu = ({ isAdmin }) => {
    return (
        <>
            {/*
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-sharp fa-solid fa-right-to-bracket"></i>
                Conectar
            </li> */}
            <a href="/profile">
                <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                    <i className="fa-sharp fa-solid fa-user"></i>
                    Mi cuenta
                </li>
            </a>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-solid fa-address-book"></i>
                Contactos
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-sharp fa-solid fa-envelope"></i>
                Mensajes
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-solid fa-gear"></i>
                Configuración
            </li>

            {isAdmin ? (
                <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                    <i className="fa-solid fa-shield"></i>
                    Administración
                </li>
            ) : (
                ""
            )}
            <a href={route("index.logout")}>
                <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Desconectar
                </li>
            </a>
        </>
    );
};
